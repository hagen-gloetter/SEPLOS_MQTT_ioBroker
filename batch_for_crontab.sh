#! /bin/bash

# Add this line to your crontab
# */2 * * * * /usr/bin/bash /home/pi/SEPLOS_MQTT_ioBroker/batch_for_crontab.sh >/dev/null 2>&1

if [[ -f /var/lock/LCK..ttyUSB_BMS ]] 
then
  echo "port locked"
  exit 1
fi

cd /home/pi/SEPLOS_MQTT_ioBroker || exit 
/usr/bin/bash query_seplos_ha1.sh 4201 > BatteryPack1.txt
/usr/bin/bash query_seplos_ha2.sh 4201 > BatteryPack2.txt
/usr/bin/bash query_seplos_ha3.sh 4201 > BatteryPack3.txt
/usr/bin/python3 sendMQTT.py
rm BatteryPack1.txt
rm BatteryPack2.txt
rm BatteryPack3.txt
