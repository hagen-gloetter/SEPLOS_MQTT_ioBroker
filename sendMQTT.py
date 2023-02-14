# python 3.6
# extension for the cool https://github.com/byte4geek/SEPLOS_MQTT
# to bring the data to ioBroker
# written by hagen@gloetter.de
# 07.02.2023

# MQTT HowTo
# https://www.emqx.com/en/blog/how-to-use-mqtt-in-python

# -------------------------
# STUFF YOU NEED TO INSTALL
# -------------------------
# sudo apt-get update
# pip install python-dotenv
# pip install paho-mqtt

# -------------------------
# Setup MQTT-Broker-Stuff
# -------------------------
# generate a file called .env in this Dir with this content:
# secretUser = "yourMQTTusername"
# secretPass = "totalsecret"
# secretHost = "iobroker.fritz.box"
# secretPort = "1883" or "1886"
# https://www.realpythonproject.com/3-ways-to-store-and-read-credentials-locally-in-python/

import time
import sys
import random
import os
from paho.mqtt import client as mqtt_client
from dotenv import load_dotenv

# Setup MQTT
broker = 'iobroker.fritz.box'
port = 1886
load_dotenv()
broker = os.environ.get('secretHost')
port = int(os.environ.get('secretPort'))
username = os.environ.get('secretUser')
password = os.environ.get('secretPass')
print("brokerHost:Port = " + broker + " "+str(port))
print("user = "+username)
client = None
BaseTopic = "Seplos"
NumberOfBatterypacks = 2
TopicName = "BatteryPack"  # Datafilename = TopicName + number + txt

myKeys = ["cell01",
          "cell02",
          "cell03",
          "cell04",
          "cell05",
          "cell06",
          "cell07",
          "cell08",
          "cell09",
          "cell10",
          "cell11",
          "cell12",
          "cell13",
          "cell14",
          "cell15",
          "cell16",
          "cell_temp1",
          "cell_temp2",
          "cell_temp3",
          "cell_temp4",
          "env_temp",
          "power_temp",
          "charge_discharge",
          "total_voltage",
          "residual_capacity",
          "amp_hours1",
          "soc",
          "amp_hours2",
          "cycles",
          "soh",
          "port_voltage"
          ]

# Functions


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(BaseTopic)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish(client, topic, value):
    # send MQTT
    result = client.publish(topic, value)
    # result: [0, 1]
    status = result[0]
    if status == 0:
        print(f"Send `{topic}` : `{value}`")
        errorcount = 0
    else:
        print(f"Failed to send message to topic {topic}")
        errorcount += 1
        if errorcount > 1500:
            pass
            # break the loop and reconnect


def main():
    client = connect_mqtt()
    client.loop_start()
    for i in range(1, NumberOfBatterypacks+1):
        fn = TopicName+str(i)+".txt"
        print(f"reading {fn}")
        file = open(fn, 'r')
        Lines = file.readlines()
        count = 0
        charge_discharge = 0
        total_voltage = 0
        mqttpath = BaseTopic + "/" + TopicName + str(i) + "/"
        for line in Lines:
            topic = mqttpath + myKeys[count]
            value = line.strip()
            #print(f"publishing: {topic} : {value}")
            if myKeys[count] == "charge_discharge":  # needed to calc power
                charge_discharge = value
            if myKeys[count] == "total_voltage":  # needed to calc power
                total_voltage = value
            publish(client, topic, value)
            count += 1
        power = float(total_voltage) * float(charge_discharge) # P = V * A
        power = round(power,2)
        publish(client, mqttpath + "power", power)
    client.loop_stop()


if __name__ == '__main__':
    sys.exit(main())
