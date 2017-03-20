<!DOCTYPE html>
<html>
<head>
  <title>Form validation for new member</title>
  <link rel = "stylesheet" type = "text/css" href = "css/finalregistration.css">
</head>
<body>
  <div id = "body">
    <div id = "title">
      <p>Brisbane Happying Parking System</p>
    </div>

    <div id = "navigation">
    <a href = "index.html">
      <div id = "home">
        <p>home</p>
      </div>
    </a>
      <div id = "aboutus">
        <p>About us</p>
      </div>
      <a href = "registration.php">
      <div id = "register_login">
        <p>register/login</p>
      </div>
    </a>
      <div id = "contactus">
        <p>contact us</p>
        </div>
      <div id = "Search">
        <p>search</p>
      </div>
    </div>
  <div id = "wrapper">
    <form method = "POST" action = "index.php" onsubmit="return Validate()" name = "vform">
      <div>
        <input type = "text" name="username" class = "textInput" placeholder="Username">
        <div id = "name_error" class = "val_error"></div>
      </div>
      <div>
        <input type = "email" name = "email" class = "textInput" placeholder= "Email">
        <div id = "email_error" class = "val_error"></div>
      </div>
      <div>
        <input type = "password" name = "password" class = "textInput" placeholder = "Password">
      </div>
      <div>
        <input type = "password" name = "password_confirmation" class = "textInput" placeholder="password_confirmation">
        <div id = "password_error" class = "val_error"></div>
      </div>
      <div>
      <input type = "address" name = "address" class = "textInput" placeholder = "address">
      <div id = "address_error" class = "val_error"></div>
    </div>
     <div>
       <input type = "suburb" name = "suburb" class = "textInput" placeholder="suburb">
       <div id = "suburb_error" class = "val_error"></div>
     </div>
      <div>
        <input type = "postcode" name = "postcode" class = "textInput" placeholder="postcode">
        <div id = "postcode_error" class = "val_error"></div>
      </div>
      <div>
        <input type = "submit" value = "Register" class = "btn" name = "register" >
      </div>
    </form>
  </div>
</body>
</html>

<!-- adding javascript -->
<script type = "text/javascript">
  //GETTING ALL INPUT TEXT OBJECTS
  var username = document.forms["vform"]["username"];
  var email = document.forms["vform"]["email"];
  var password = document.forms["vform"]["password"];
  var password_confirmation = document.forms["vform"]["password_confirmation"];
  var address = document.forms["vform"]["address"];
  var suburb = document.forms["vform"]["suburb"];
  var postcode = document.forms["vform"]["postcode"];

  //GETTING ALL ERRORS DISPLAY OBJECTS
  var name_error = document.getElementById("name_error");
  var email_error = document.getElementById("email_error");
  var password_error = document.getElementById("password_error");
  var address_error = document.getElementById("address_error");
  var suburb_error = document.getElementById("suburb_error");
  var postcode_error = document.getElementById("postcode_error");

  //SETTING ALL EVENT LISTENER
   username.addEventListener("blur", nameverify, true);
   email.addEventListener("blur", emailverify, true);
   password.addEventListener("blur", passwordverify, true);
   address.addEventListener("blur", addressverify, true);
   suburb.addEventListener("blur", suburbverify, true);
   postcode.addEventListener("blur", postcodeverify, true);

   //validation funciton
   function Validate(){
     //username validation
     if (username.value == ""){
       username.style.border = "1px solid red";
       name_error.textContent = "username is required";
       alert("please insert name");
       username.focus();
       return false;
     }

     //email validation
      if (email.value == ""){
        email.style.border = "1px solid red";
        email_error.textContent = "email is required";
        alert("please insert email");
        email.focus();
        return false;
      }

      // password validation
      if (password.value == ""){
        password.style.border = "1px solid red";
        password_error.textContent = "password is required";
        alert("please insert password");
        password.focus();
        return false;
      }

      //check if the two password same
      if (password.value != password_confirmation.value){
        password.style.border = "1px solid red";
        password_confirmation.style.border = "1px solid red";
        password_error.innerHTML = "The two passwords do not match";
        alert("please insert the same password");
        return false;
      }

     //address validation
      if (address.value == ""){
        address.style.border = "1px solid red";
        address_error.textContent = "address is required";
        alert("please insert address");
        address.focus();
        return false;
      }

      if (suburb.value == ""){
        suburb.style.border = "1px solid red";
        suburb_error.textContent = "suburb is required";
        alert("please insert suburb");
        suburb.focus();
        return false;
      }

      if (postcode.value == ""){
        postcode.style.border = "1px solid red";
        postcode_error.textContent = "postcode is required";
        alert ("please insert postcode!");
        postcode.focus();
        return false;
      }
   }

// event handler functions
function nameverify() {
      if (username.value != ""){
        username.style.border = "1px solid #5E6E66";
        name_error.innerHTML = "";
        return true;
      }
}

function emailverify(){
    if (email.value != ""){
      email.style.border = "1px solid #5E6E66";
      email_error.innerHTML = "";
      return true;
    }
}

function passwordverify(){
  if (password.value != ""){
    password.style.border = "1px solid #5E6E66";
    password_error.innerHTML = "";
    return true;
  }
}

function addressverify(){
  if (address.value != ""){
    address.style.border = "1px solid #5E6E66";
    address_error.innerHTML = "";
    return true;
  }
}

function suburbverify(){
  if (suburb.value != ""){
    suburb.style.border = "1px solid #5E6E66";
    suburb_error.innerHTML = "";
    return true;
  }
}

function postcodeverify(){
  if (postcode.value != ""){
    postcode.style.border = "1px solid #5E6E66";
    postcode_error.innerHTML = "";
    return true;
  }
}
</script>
