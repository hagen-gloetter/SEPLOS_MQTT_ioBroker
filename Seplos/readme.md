
Files
=====

readme.md          -> this file
query_seplos_ha.sh -> modified for use with device name and baudrate setting.
doCalMinMax.sh     -> Called after query_seplos_ha.sh to calulate low/high cell and diff
sendMQTT.py        -> send to MQTT server via python script.
VIS/bms_vis.txt    -> exported View for ioBroker VIS adjust the first line for your mqtt settings
VIS/BMS1.png       -> example screen shot from bms_vis.txt
you you have more than one -> just use search / replace BMS1 -> BMS2 and so on.

Install
=======
you need to create a file .env in the directoy of sendMQTT.py.

--------------------------
secretUser = "mqtt"
secretPass = "somePasswordForMQTT"
secretHost = "127.0.0.1"
secretPort = "1883"
---------------------------

The you need a cron jobs e.g. each 15 min to read each bms ( you have have more than one)
calulcating the values and send to mqtt.
the 4201 is the magic to read the data from seplos BMS.
then the devicename
the baudrate most will use 19200 ( only if you have a pylonprotocoll ordered from seplos you need 9600)
then the address of the system first system is 00 (the default) or 01 first the first in a multiple then 02,03.

example cron looks like this.
---------------------------
#!/bin/bash

if [[ -f /var/lock/LCK..ttyUSB_BMS ]] 
then
  echo "port locked"
  exit 1
fi

UD=`dirname $0`

$UD/query_seplos_ha.sh 4201 /dev/ttyUSB_BMS 19200 01 > /tmp/BMS.txt
$UD/doCalMinMax.sh
python $UD/sendMQTT.py BMS1 /tmp/BMSP.txt 

#if you have more than one 02->BMS2 03->BMS3,04....
#$UD/query_seplos_ha.sh 4201 /dev/ttyUSB_BMS 19200 02 > /tmp/BMS.txt
#$UD/doCalMinMax.sh
#python $UD/sendMQTT.py BMS2 /tmp/BMSP.txt 

-----------------------------
