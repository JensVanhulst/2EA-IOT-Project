<?php
     include_once ("./db.php");
     date_default_timezone_set("Europe/Brussels");

     $link = new mysqli( DB_HOST, DB_USER, DB_PASS, DB_DATABASE );

    // // Output any connection error
    // if ($link->connect_error) {
    //     die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
    // } else {
    //     echo "Connection";
    // }

    $latest_temp_value = $link->query("SELECT Value From SensorData WHERE ID='SENSOR_001_TEMP' ORDER BY Timestamp DESC LIMIT 1");
    $latest_light_value = $link->query("SELECT Value From SensorData WHERE ID='SENSOR_002_LIGHT' ORDER BY Timestamp DESC LIMIT 1");
    $average_temp =  $link->query("SELECT CAST(Timestamp AS date), AVG(Value) From SensorData WHERE ID='SENSOR_001_TEMP' GROUP BY CAST(Timestamp AS date) ORDER BY CAST(Timestamp AS date) DESC LIMIT 1");
    $average_light =  $link->query("SELECT CAST(Timestamp AS date), AVG(Value) From SensorData WHERE ID='SENSOR_002_LIGHT' GROUP BY CAST(Timestamp AS date) ORDER BY CAST(Timestamp AS date) DESC LIMIT 1");
    
    while ($row = mysqli_fetch_row($latest_temp_value)) { $latest_temp_value_storage = $row[0]; }
    while ($row = mysqli_fetch_row($latest_light_value)) { $latest_light_value_storage = $row[0]; }
    while ($row = mysqli_fetch_row($average_temp)) { $average_temp_value_storage = $row[1]; }
    while ($row = mysqli_fetch_row($average_light)) { $average_light_value_storage = $row[1]; }

    $sql_title = "Daily summary of PXL-IOT";
    $string = "Laatst gemeten temperatuur = " . $latest_temp_value_storage . " °C" . "<br>" .
              "Laatst gemeten lichtintensiteit = " . $latest_light_value_storage . " lx" . "<br>" .
              "Gemiddelde temperatuur = " . $average_temp_value_storage . " °C" . "<br>" .
              "Gemiddelde lichtintensiteit = " . $average_light_value_storage . " lx" ."<br>";
    $publication_date = date("D, d M Y H:i:s T");
    $author = "11801318 / Jens Vanhulst";

    /* file path to saved xml document */
    $xmlfile= './feed.xml';
    /* whether to display XML in browser or simply save */
    $displayxml=true;
    /* create DOMDocument and set args */
    $dom=new DOMDocument('1.0','utf-8');
    $dom->standalone=true;
    $dom->formatOutput=true;
    $dom->recover=true;
    $dom->strictErrorChecking=false;

    /* a ROOT node for the document */
    $rootnode='channel';

    /* if the file already exists, open it */
    if(realpath($xmlfile)){
        $dom->load($xmlfile);
        $root=$dom->getElementsByTagName($rootnode)->item(0);
    } else {
        /* File does not exist, create root elements & content */
        $root=$dom->createElement( $rootnode );
        $dom->appendChild( $root );   
    }

    if(true){
        $item = $dom->createElement('item');
        $root->appendChild( $item );

        $title = $dom->createElement('title',$sql_title );
        $item->appendChild($title);

        $description = $dom->createElement('description',$string);
        $item->appendChild($description);

        $author = $dom->createElement('author',$author);
        $item->appendChild($author);

        $pubDate = $dom->createElement('pubDate',$publication_date);
        $item->appendChild($pubDate);
    }

    /* save the file */
    $dom->save($xmlfile);
    mysqli_close($link);

    /* if you want to see the generated xml in the browser */
    if($displayxml){
        header('Content-Type: application/xml');
        echo $dom->saveXML();
    }
?>