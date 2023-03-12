// Scrit for PIP MPS5048MAX with Mqtt statistic.
// only used as PV Charger.
// Solar_kWh    -> (Batt)


var sUdBmsSoc = '0_userdata.0.bms.soc';
var sUdBmsI = '0_userdata.0.bms.i';


schedule('* * * * *', BmsMinuteScript); // jede Minute
schedule({hour: 23, minute: 58}, RunDailyScript );
 
function createVars()
{
    // UD Variablen
    createState(sUdBmsSoc, 0);
    createState(sUdBmsI, 0);
    log("createVars called ");
}

function BmsMinuteScript() 
{
    //createVars();
    let soc1    = getState('mqtt.0.BMS1.soc').val;
    let soc2    = getState('mqtt.0.BMS1.soc').val;
    let soc = (soc1 + soc2) / 2;
    setState(sUdBmsSoc,soc);

    let cd1    = getState('mqtt.0.BMS1.charge_discharge').val;
    let cd2    = getState('mqtt.0.BMS1.charge_discharge').val;
    let cd = (cd1 + cd2) / 2;
    setState(sUdBmsI,cd);
    


    log("minute soc: " + soc);
}

//setState(dayName, last);
  
function RunDailyScript() 
{
  //  move2dayAndClear(sUdPvTWattMinuten     ,sUdDayPvTkWh);
    log("midnight stuff " );
}
