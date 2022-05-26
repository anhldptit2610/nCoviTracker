import paho.mqtt.client as mqtt
from time import sleep
import json

broker='localhost'
port=1883
data_topic="temp-humi-bodytemp-co2-topic"

client_id='doan_htn_client'

#connect to mqtt broker
client = mqtt.Client(client_id)
client.connect(broker)

while True:
    amb_temp_f = open("/sys/bus/iio/devices/iio:device0/in_temp_raw", "r")
    amb_humi_f = open("/sys/bus/iio/devices/iio:device0/in_humidityrelative_raw", "r")
    amb_co2_f = open("/sys/bus/iio/devices/iio:device1/in_concentration_co2_raw", "r")
    body_temp_f = open("/home/debian/DoAn_HTN/gy906_data", "r")

    raw_amb_temp = amb_temp_f.read()
    amb_temp = int((int(raw_amb_temp) / 65536) * 165 - 40)
    raw_amb_humi = amb_humi_f.read()
    amb_humi = int((int(raw_amb_humi) / 65536) * 100)
    amb_eco2 = int(amb_co2_f.read())
    body_temp = int(body_temp_f.read())

    data_set = {"Temperature" : str(amb_temp), "Humidity": str(amb_humi), "BodyTemp": str(body_temp), "Eco2": str(amb_eco2)}
    json_dump = json.dumps(data_set)

    client.publish(data_topic, json_dump)
    amb_temp_f.close()
    amb_humi_f.close()
    amb_co2_f.close()
    body_temp_f.close()
    sleep(3)
