DELETE FROM SensorData
Select CAST(Timestamp AS date), AVG(Value) From SensorData GROUP BY CAST(Timestamp AS date)
SELECT * FROM SensorData WHERE Timestamp BETWEEN "2019-12-16" AND "2019-12-19"
select * from SensorData where week(`Timestamp`) = week(curdate())
SELECT * FROM SensorData WHERE Timestamp BETWEEN week(curdate()) AND week(46);