// Scrit for PIP MPS5048MAX with Mqtt statistic.
// only used as PV Charger.
// Solar_kWh    -> (Batt)


var sUdBase = '0_userdata.0.inv_5kw.';
var sUdMqttBase = 'mqtt.0.inv_5kw.pip.';  // Line oder  

var sUdPvTWattMinuten   = sUdBase + 'PvTWattMinunten';  // T = Total 
var sUdActPvTkWh        = sUdBase + 'act.PvTkWh';
var sUdDayPvTkWh        = sUdBase + 'day.PvTkWh';

// :60 watt stunden und 1000 kwh.
let wmin2kwh = 1000 * 60;
    

schedule('* * * * *', InverterMinuteScript); // jede Minute
schedule({hour: 23, minute: 58}, RunDailyScript );
 
function createVars()
{
    // UD Variablen
    createState(sUdPvTWattMinuten, 0);
    createState(sUdActPvTkWh, 0);
    createState(sUdDayPvTkWh, 0);
    log("createVars called ");
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function incrementVariable(varName, incValue, actKwhVar) 
{
//    log("incrementVariable  " + varName + " " + actKwhVar);
    let lastVal = getState(varName).val;
    lastVal += incValue;
    setState(varName, lastVal);
    let kwh = lastVal /wmin2kwh;
    setState(actKwhVar, precisionRound(kwh , 3)     );
}

function InverterMinuteScript() 
{
    createVars();
    let actPvTWatt    = getState(sUdMqttBase + 'pvchargew').val;
    incrementVariable(sUdPvTWattMinuten, actPvTWatt, sUdActPvTkWh);
    //log("minute: " + actWatt + " -> " + actMode);
}

function move2dayAndClear(actName, dayName)
{
    let last = getState(actName).val;
    setState(dayName, last);
    setState(actName, 0);
}

function RunDailyScript() 
{
    move2dayAndClear(sUdPvTWattMinuten     ,sUdDayPvTkWh);
    log("midnight stuff " );
}
