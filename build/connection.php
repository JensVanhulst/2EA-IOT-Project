<?php
  $username = "root";
  $pass = "d3mo-psw-123%";
  $host = "mysql";
  $db_name = "PXL-IOT";
  $con = mysqli_connect ( $host, $username, $pass );
  $db = mysqli_select_db ( $con, $db_name );
?>
