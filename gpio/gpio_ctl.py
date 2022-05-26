import Adafruit_BBIO.GPIO as GPIO
import paho.mqtt.client as mqtt

# mqtt-related part
broker = 'localhost'
port = 1883
fan_notifier = 'fan-topic'
dehumi_notifier = 'dehumi-topic'
lamp_notifier = 'lamp-topic'

# gpio setup part
fan_pin = 'P8_8'
dehumi_pin = 'P8_10'
lamp_pin = 'P8_12'

GPIO.setup(fan_pin, GPIO.OUT)
GPIO.setup(dehumi_pin, GPIO.OUT)
GPIO.setup(lamp_pin, GPIO.OUT)

# main part of the show
def on_connect(client, userdata, flags, rc):
    print("Connected with result code" + str(rc))
    client.subscribe([(fan_notifier, 0), (dehumi_notifier, 0), (lamp_notifier, 0)])

def fan_on_message(client, userdata, msg):
    if int(msg.payload) == 1:
        GPIO.output(fan_pin, GPIO.HIGH)
    else:
        GPIO.output(fan_pin, GPIO.LOW)

def dehumi_on_message(client, userdata, msg):
    if int(msg.payload) == 1:
        GPIO.output(dehumi_pin, GPIO.HIGH)
    else:
        GPIO.output(dehumi_pin, GPIO.LOW)
    
def lamp_on_message(client, userdata, msg):
    if int(msg.payload) == 1:
        GPIO.output(lamp_pin, GPIO.HIGH)
    else:
        GPIO.output(lamp_pin, GPIO.LOW)

client = mqtt.Client()
client.on_connect = on_connect

message_callback_add(fan_notifier, fan_on_message)
message_callback_add(dehumi_notifier, dehumi_on_message)
message_callback_add(lamp_notifier, lamp_on_message)

client.connect(broker, port, 60)
client.loop_forever()
