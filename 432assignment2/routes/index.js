var express = require('express');
var setupConfig = require('../config');
var Twitter = require('node-tweet-stream');
var sentiment = require('sentiment');
var router = express.Router();
var io = require('socket.io');
var dateFormat = require('dateformat');
var chartjs = require("chartjs");

var d3 = require("d3");

var angry = 0;
var netural = 0;
var happy = 0;

// Save keywords
var multiTag = [];
var count=0;

var rating;
var testTweetCount = 0;
var stream;
var color;

// Setup Credential for Twitter
var clientTweet = new Twitter({
  consumer_key: setupConfig.consumer_key,
  consumer_secret: setupConfig.consumer_secret,
  token: setupConfig.access_token_key,
  token_secret: setupConfig.access_token_secret

});

function resetMonitoring() {
    if (stream) {
        var tempStream = stream;
        stream = null;  // signal to event handlers to ignore end/destroy
        tempStream.destroySilent();
    }
    monitoringPhrase = "";
}




// Monitor the phrases
function beginMonitoring(phrase) {
    // cleanup if we're re-setting the monitoring
    if (monitoringPhrase) {
        resetMonitoring();
    }
    monitoringPhrase = phrase;
    //tweetCount = 0;
    //tweetTotalSentiment = 0;

    tweeter.verifyCredentials(function (error, data) {
        if (error) {
            resetMonitoring();
            console.error("Error connecting to Twitter: " + error);
            if (error.statusCode === 401)  {
                console.error("Authorization failure.  Check your API keys.");
            }
        } else {
            tweeter.stream('statuses/filter', {
                'track': monitoringPhrase
            }, function (inStream) {
                // remember the stream so we can destroy it when we create a new one.
                // if we leak streams, we end up hitting the Twitter API limit.
                stream = inStream;
                console.log("Monitoring Twitter for " + monitoringPhrase);
                stream.on('data', function (data) {
                    // only evaluate the sentiment of English-language tweets
                    if (data.lang === 'en') {
                        sentiment(data.text, function (err, result) {
                            tweetCount++;
                            tweetTotalSentiment += result.score;
                            rating = result.score;
                            console.log(result.score);
                        });
                    }
                });
                stream.on('error', function (error, code) {
                    console.error("Error received from tweet stream: " + code);
                    if (code === 420)  {
                        console.error("API limit hit, are you using your own keys?");
                    }
                    resetMonitoring();
                });
                stream.on('end', function (response) {
                    if (stream) { // if we're not in the middle of a reset already
                        // Handle a disconnection
                        console.error("Stream ended unexpectedly, resetting monitoring.");
                        resetMonitoring();
                    }
                });
                stream.on('destroy', function (response) {
                    // Handle a 'silent' disconnection from Twitter, no end/error event fired
                    console.error("Stream destroyed unexpectedly, resetting monitoring.");
                    resetMonitoring();
                });
            });
            return stream;
        }
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {

    count++;
    res.render('index', { title: count });

    // Initial Connection of socket between server and client
    res.io.on('connection',function(socket) {

    // Store multiple tag entered by user
    socket.searchMultipleTags = [];
    // Determine the connection has been established
    console.log("User " +socket.id+  " is connected");


    // Search the tweets
    socket.on("searchTweet", function (data) {
          var exist = false;

          for (var i = 0; i < socket.searchMultipleTags.length; i++){
            if(socket.searchMultipleTags[i] == data) {
                exist = true;
                break;
            }

          }

          // Add the phrases if it is not existed
          if(!exist) {

            socket.searchMultipleTags.push(data);
            multiTag.push(data);
            clientTweet.track(data);
            // Debug the number of tag existed in socket multiple tags
            console.log(socket.searchMultipleTags.length);

          }

    });

    //Remove particular tags
    socket.on("removeTagTweet", function(data) {
        for(var i = 0; i < socket.searchMultipleTags.length; i++) {
            if(data === socket.searchMultipleTags[i]) {
                socket.searchMultipleTags.splice(i,i+1);
                multiTag.splice(i,i+1);
                clientTweet.untrack(data);
                //track the particular tag that has been removed
                console.log(data);
                break;

            }
        }

    });

    // Clear all tag
    socket.on("clearAllTag", function(data) {
        socket.searchMultipleTags=[];
        multiTag = [];
        clientTweet.untrackAll();

    });


    // Find and filter the tweet
    clientTweet.on('tweet', function (tweet) {
        for(var i=0; i<socket.searchMultipleTags.length;i++) {
            if(tweet.text.indexOf(socket.searchMultipleTags[i])!=-1) {
                ResultOfTweet(tweet, socket);
                console.log("it works");
            }
        }
    });



  });

});



//Get results of tweet
function ResultOfTweet(tweet,socket) {

    if(tweet.lang=='en') {
        var profileUrl = "https://twitter.com/" + tweet.user.screen_name;
        var createdTime = tweet.created_at;
        var url = tweet.user.profile_banner_url;
        var urlLocation = tweet.user.location;

      if (typeof url === 'undefined'){
        url = "images/no_available.png";
        console.log('url not defined');
      } else if (typeof url === '404'){
        url = "images/profile-unavailable.png";
        console.log('profiles not defined');
      }

      else {
        url += "";
      }



      if (typeof profileUrl === 'undefined'){
        profileUrl = "images/profile-unavailable.png";
        console.log('profile not defined');
      } else {
        profileUrl += "";
      }

      if(urlLocation === 'null'){
          urlLocation = 'Not Available';
      }



        sentiment(tweet.text, function (err,result) {
           rating = result.score;
        });

        var mood = "";
        var emotion = "";

        var color = "";
        if(rating <= -2){
            mood = "angry";
            emotion = "angry";
            color = "#ff0000";
            angry ++;

        }else if(-1 <= rating && rating <= 2){
            mood = "normal";
            emotion = "normal";
            color = "#ffff00";
            netural ++;


        }else if(rating > 2){
            mood = "happy";
            emotion = "happy";
            color = "#007780";
            happy ++;
        }






        createdTime = dateFormat(createdTime, "yyyy-mm-dd h:MM TT");
        var FormattedTweets=[];

        FormattedTweets.push('<li class = "'+mood+'"><a href="' + profileUrl + '" target="_blank"><img src="' + url + '" style="width: auto; height:220px"' +
            'width="280" height="250"></a><div class="post-info">' +
            '<div class="post-basic-info"><img src ="' + tweet.user.profile_image_url + '" style="width:40px; height:40px; float:left; border-radius: 50%"><h3><a href="' + profileUrl + '" target="_blank">' +
            tweet.user.name + '</a></h3><span><br/><a href="#">' + createdTime + '<br/><label>' +
            '</label>' + urlLocation + '</a></span><p>' + tweet.text + '</p></div>' +
            '<div id= "'+emotion+'"></div>' +
            '<div class="post-info-rate-share" style="background-color:' + color + '"><p5>' + rating +'</p5><div class="rateit">' +
            '<span></span></div><div class="post-share"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tweet.user.friends_count + '</span>' +
            '</div><div class="clear"></div></div></div></li>');
        FormattedTweets.push(rating);

        console.log(tweet.text);
        console.log(happy);
        console.log(netural);
        console.log(angry);


        socket.emit("resultTweet", FormattedTweets);
    //    socket.emit("resultChart", Formattedchart);

    }

}


module.exports = router;
