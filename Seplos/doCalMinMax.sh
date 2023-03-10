#!/bin/bash
# remove last 2 lines... (DEBUG info)
QUERY=$(head -n -2 /tmp/BMS.txt)
 
# Find lowest and high value
onlycells=$(echo $QUERY|awk '{print $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16}')

#echo ${onlycells[@]}
lowcell=$(echo ${onlycells[@]} | awk 'BEGIN{RS=" ";} {print $1}' | sort| sed -n 1p)
highcell=$(echo ${onlycells[@]} | awk 'BEGIN{RS=" ";} {print $1}' | sort| sed -n 16p)

# calulate difference
DIFF=`bc -l <<< $highcell-$lowcell`

# find the number of the lowest and highest cell
lowcellnumb=$(echo ${onlycells[@]} | awk 'BEGIN{RS=" ";} {print $1}' |nawk '{print $0, FNR}'| sort|sed -n 1p|awk '{print $2}')
highcellnumb=$(echo ${onlycells[@]} | awk 'BEGIN{RS=" ";} {print $1}' |nawk '{print $0, FNR}'| sort|sed -n 16p|awk '{print $2}')

head -n -2 /tmp/BMS.txt > /tmp/BMSP.txt
echo $DIFF >> /tmp/BMSP.txt
echo $lowcell >> /tmp/BMSP.txt
echo $highcell >> /tmp/BMSP.txt
echo $lowcellnumb >> /tmp/BMSP.txt
echo $highcellnumb >> /tmp/BMSP.txt

#echo "X $lowcell $highcell $DIFF $lowcellnumb $highcellnumb"
#\"lowest_cell_v\":\"$lowcell\",\
#\"lowest_cell_n\":\"$lowcellnumb\",\
#\"highest_cell_v\":\"$highcell\",\
#\"highest_cell_n\":\"$highcellnumb\",\
#\"difference\":\"$DIFF\",\
