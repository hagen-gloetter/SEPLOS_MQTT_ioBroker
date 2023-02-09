#! /bin/bash

# Add this line to your crontab
# */2 * * * * /usr/bin/bash batch_for_crontab.sh >/dev/null 2>&1

cd /home/pi/SEPLOS_MQTT_ioBroker || exit 
/usr/bin/bash query_seplos_ha1.sh 4201 > BatteryPack1.txt
/usr/bin/bash query_seplos_ha2.sh 4201 > BatteryPack2.txt
/usr/bin/python3 sendMQTT.py
rm BatteryPack1.txt
rm BatteryPack2.txt
