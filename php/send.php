<?php
  include ('connection.php');
  $sql_insert = "INSERT INTO SensorData (ID, Value) VALUES ('".$_GET["ID"]."', '".$_GET["Val"]."')";
  if(mysqli_query($con,$sql_insert))
  {
    echo "Done";
    mysqli_close($con);
  } else {
    echo "error is ".mysqli_error($con );
  }
?>