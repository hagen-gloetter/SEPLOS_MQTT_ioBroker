// Scrit for PIP MPS8048MAX with Mqtt statistic.

// Imported_kWh  (Line mode)
// Solar_kWh    -> (Batt)
// PvCharged_kWh  -> was kam runter
// AcCharged_kWh  ( vom net geladen)

var sUdBase = '0_userdata.0.inverter.';
var sUdMqttBase = 'mqtt.0.inverter.pip.';  // Line oder  
// status BAT

// 
var sUdOutputWattMinuten   = sUdBase + 'OutputWattMinunten';
var sUdImportedWattMinuten = sUdBase + 'ImportedWattMinunten';
var sUdSolarWattMinuten    = sUdBase + 'SolarWattMinunten';  // was direkt solar erzeugt wurde.
var sUdPvTWattMinuten      = sUdBase + 'PvTWattMinunten';  // T = Total 
var sUdPv1WattMinuten      = sUdBase + 'Pv1WattMinunten';  
var sUdPv2WattMinuten      = sUdBase + 'Pv2WattMinunten';  
var sUdAcChargeWattMinuten = sUdBase + 'AcChargeWattMinunten';  

var sUdActInvLineMode   = sUdBase + 'act.lineMode';

var sUdActOutputkWh     = sUdBase + 'act.OutputkWh';
var sUdActImportedkWh   = sUdBase + 'act.ImportedkWh';
var sUdActSolarkWh      = sUdBase + 'act.SolarkWh';
var sUdActPvTkWh        = sUdBase + 'act.PvTkWh';
var sUdActPv1kWh        = sUdBase + 'act.Pv1kWh';
var sUdActPv2kWh        = sUdBase + 'act.Pv2kWh';
var sUdActAcChargekWh   = sUdBase + 'act.AcChargekWh';

var sUdDayOutputkWh     = sUdBase + 'day.OutputkWh';
var sUdDayImportedkWh   = sUdBase + 'day.ImportedkWh';
var sUdDaySolarkWh      = sUdBase + 'day.SolarkWh';
var sUdDayPvTkWh        = sUdBase + 'day.PvTkWh';
var sUdDayPv1kWh        = sUdBase + 'day.Pv1kWh';
var sUdDayPv2kWh        = sUdBase + 'day.Pv2kWh';
var sUdDayAcChargekWh   = sUdBase + 'day.AcChargekWh';


//var sUdDayInverterkWh = sUdBase + 'day.inverterkWh';  // vom vortag

var sUdActInvMinLineMode = sUdBase + 'act.MinutenLineMode';
var sUdActInvMinBattMode = sUdBase + 'act.MinutenBattMode';

//var sUdActInverterkWh = sUdBase + 'act.Solar_kWh';
//var sUdDayInverterkWh = sUdBase + 'day.Solar_kWh';  // vom vortag

// :60 watt stunden und 1000 kwh.
let wmin2kwh = 1000 * 60;
    

schedule('* * * * *', InverterMinuteScript); // jede Minute
schedule({hour: 23, minute: 59}, RunDailyScript );
 
function createVars()
{
    // UD Variablen
    createState(sUdOutputWattMinuten, 0);
    createState(sUdImportedWattMinuten, 0);
    createState(sUdSolarWattMinuten, 0);
    createState(sUdPvTWattMinuten, 0);
    createState(sUdPv1WattMinuten, 0);
    createState(sUdPv2WattMinuten, 0);
    createState(sUdAcChargeWattMinuten, 0);

    createState(sUdActOutputkWh, 0);
    createState(sUdActImportedkWh, 0);
    createState(sUdActSolarkWh, 0);
    createState(sUdActPvTkWh, 0);
    createState(sUdActPv1kWh, 0);
    createState(sUdActPv2kWh, 0);
    createState(sUdActAcChargekWh, 0);

   createState(sUdActInvLineMode, true);
   createState(sUdActInvMinLineMode, 0);
   createState(sUdActInvMinBattMode, 0);

   createState(sUdDayOutputkWh, 0);
   createState(sUdDayImportedkWh, 0);
   createState(sUdDaySolarkWh, 0);
   createState(sUdDayPvTkWh, 0);
   createState(sUdDayPv1kWh, 0);
   createState(sUdDayPv2kWh, 0);
   createState(sUdDayAcChargekWh, 0);
   
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
    //createVars();

    // Are we online or on batt -Y Solpip only reports string ?!
    let sActMode = getState(sUdMqttBase + 'masterstatus').val;
    let bLineMode = false;
    let bBattMode = false;
    if (sActMode == "Line") {
        bLineMode = true;               
    }
    if (sActMode == "Battery") {
        bBattMode = true;               
    }

    let sActStatus = getState(sUdMqttBase + 'status').val;
    let bAcChardeMode = false;
    if (sActStatus == "uti") {
        bAcChardeMode = true;      // we charge Batt from EVU and Load is on EVU.           
    }
    

    // akutelle werte
    let actOutputWatt = getState(sUdMqttBase + 'acoutw').val;
    let actPvTWatt    = getState(sUdMqttBase + 'totalsolarw').val;
    let actPv1Watt    = getState(sUdMqttBase + 'pvchargew').val;
    let actPv2Watt    = getState(sUdMqttBase + 'pv2chargew').val;
 
    incrementVariable(sUdOutputWattMinuten, actOutputWatt, sUdActOutputkWh);
    if (bLineMode)
    {
        incrementVariable(sUdImportedWattMinuten, actOutputWatt, sUdActImportedkWh);    
    }
    if (bBattMode) 
    {
        incrementVariable(sUdSolarWattMinuten, actOutputWatt, sUdActSolarkWh);
    }
    incrementVariable(sUdPvTWattMinuten, actPvTWatt, sUdActPvTkWh);
    incrementVariable(sUdPv1WattMinuten, actPv1Watt, sUdActPv1kWh);
    incrementVariable(sUdPv2WattMinuten, actPv2Watt, sUdActPv2kWh);
    
    //log("bAcChardeMode  " + bAcChardeMode + " " + sActStatus);
    if(bAcChardeMode) 
    {
        let actbattchrgt    = getState(sUdMqttBase + 'battchrg').val;
        let actbattv        = getState(sUdMqttBase + 'battv').val;
        let actAcChargeW    = actbattchrgt * actbattv;
        incrementVariable(sUdAcChargeWattMinuten, actAcChargeW, sUdActAcChargekWh);
    }

    // mode erstellen    
    let lastLineMode = getState(sUdActInvLineMode).val;
    
    setState(sUdActInvLineMode,bLineMode); // remeber
    if (bLineMode != lastLineMode)
    {
        // change mode
    }


    if (bLineMode) 
    {
        setState(sUdActInvMinLineMode, getState(sUdActInvMinLineMode).val + 1);
    } else {
        setState(sUdActInvMinBattMode, getState(sUdActInvMinBattMode).val + 1);
    }

//var  = sUdBase + 'act.lineMode';
//var sUdActInvMinLineMode = sUdBase + 'act.MinutenLineMode';
//var sUdActInvMinBattMode = sUdBase + 'act.MinutenBattMode';


    //log("minute: " + actWatt + " -> " + actMode);
}

function move2dayAndClear(actName, dayName, minVal)
{
    let last = getState(actName).val;
    setState(dayName, last);
    // clear
    setState(actName, 0);
    setState(minVal, 0);
}

function RunDailyScript() 
{
    move2dayAndClear(sUdActOutputkWh       ,sUdDayOutputkWh    ,sUdOutputWattMinuten);
    move2dayAndClear(sUdImportedWattMinuten,sUdDayImportedkWh  ,sUdImportedWattMinuten);
    move2dayAndClear(sUdSolarWattMinuten   ,sUdDaySolarkWh     ,sUdSolarWattMinuten);
    move2dayAndClear(sUdPvTWattMinuten     ,sUdDayPvTkWh       ,sUdPvTWattMinuten);
    move2dayAndClear(sUdPv1WattMinuten     ,sUdDayPv1kWh       ,sUdPv1WattMinuten);
    move2dayAndClear(sUdPv2WattMinuten     ,sUdDayPv2kWh       ,sUdPv2WattMinuten);
    move2dayAndClear(sUdAcChargeWattMinuten,sUdDayAcChargekWh  ,sUdAcChargeWattMinuten);
    
    log("Skript wird jeden Tag um 23:39 ausgeführt: " );
}
