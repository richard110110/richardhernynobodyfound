<?php
echo "<table style='border: solid 1px black;'>";
  echo "<tr><th>Id</th><th>Name</th><th>Email</th></tr>";

class TableRows extends RecursiveIteratorIterator {
     function __construct($it) {
         parent::__construct($it, self::LEAVES_ONLY);
     }

     function current() {
         return "<td style='width: 150px; border: 1px solid black;'>" . parent::current(). "</td>";
     }

     function beginChildren() {
         echo "<tr>";
     }

     function endChildren() {
         echo "</tr>" . "\n";
     }
}

$dsn = "mysql:host=localhost;localhost=8889;dbname=CAB230";
  $db_user = 'root';
  $db_password = 'tale123';
  $db = new PDO($dsn, $db_user, $db_password);

  $regis =$db->prepare("SELECT ID,Name,Email FROM registration");
  $regis->execute();
  $result = $regis->setFetchMode(PDO::FETCH_ASSOC);

foreach(new TableRows(new RecursiveArrayIterator($regis->fetchAll())) as $k=>$v) {
    echo $v;
}

  echo"123";


  ?>
