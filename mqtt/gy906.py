from mlx90614 import MLX90614
import paho.mqtt.client as mqtt

# mqtt-related part
broker = 'localhost'
port = 1883
notify_topic = 'bodytemp-check-notify-topic'

# gy-906 initialization part
thermometer_addr = 0x5a
thermometer = MLX90614(thermometer_addr)

# main part of the show
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe(notify_topic)

def on_message(client, userdata, msg):
    if int(msg.payload) == 1:
        body_temp_f = open("/home/debian/DoAn_HTN/gy906_data", "r")
        body_temp_f.write(thermometer.get_obj_temp())
        body_temp_f.close()


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(broker, port, 60)
client.loop_forever()

