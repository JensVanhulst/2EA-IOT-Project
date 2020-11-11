import requests
import random
from apscheduler.schedulers.blocking import BlockingScheduler

scheduler = BlockingScheduler()

def publish_temp():
    temp_sensor_id = "SENSOR_001_TEMP"
    r = requests.get("http://php:80/send.php", params={
        'ID': temp_sensor_id,
        'Val': random.randint(-10, 40)
    })

    print("send temp")

def publish_light():
    temp_sensor_id = "SENSOR_002_LIGHT"
    r = requests.get("http://php:80/send.php", params={
        'ID': temp_sensor_id,
        'Val': random.randint(0, 200)
    })

    print("send light")

# 900000
# Schedule job_function to be called every two hours
scheduler.add_job(publish_temp, 'interval', seconds=1)
scheduler.add_job(publish_light, 'interval', seconds=2)

scheduler.start()