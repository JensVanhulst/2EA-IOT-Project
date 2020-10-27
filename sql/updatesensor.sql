SELECT Value, Timestamp From SensorData WHERE ID='SENSOR_001_TEMP' ORDER BY Timestamp DESC LIMIT 1;
SELECT Value, Timestamp From SensorData WHERE ID='SENSOR_002_LIGHT' ORDER BY Timestamp DESC LIMIT 1;

UPDATE SensorOverview SET Value = "v" , Timestamp = "v" WHERE ID="SENSOR_001_TEMP";