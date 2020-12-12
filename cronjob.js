const cron = require("node-cron");
const schedule = require('node-schedule');

const solar = require("./routes/DataRoutes");
const timerData = require("./routes/Timer");
const devices = require("./routes/DeviceRoutes");

cron.schedule("*/15 * * * * *", function() {
   // Get all schedules
   // console.log("Checking schedule!");
   test()
});

/* Add new solar data at the end of each night */
schedule.scheduleJob('59 23 * * *', function() {
    console.log("Adding solar data");
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var dayOfYear = 0;
    for(i = 0; i < month-1; i++){
        dayOfYear += daysInMonth[i];
    }
    dayOfYear += date.getDate();
    var powerProduced = (-32 * Math.cos(0.01721420632 * dayOfYear)+48)*(Math.random() * -Math.cos(0.01721420632*dayOfYear)+1)

    solar.SolarDate(year, month, powerProduced);
});



async function test(){
    // Get scheduling Data
    var data = await timerData.AllSchedules()

    //Get current time to compare to
    var curTime = new Date();

    // Compare the current time to the schedules.
    data.forEach(e => {
        //Check if the device should be started
        if(curTime > e.startdate){

            if(e.enddate > curTime){        // Turn on device
                devices.schedule(e.device_id, true);
            }else{                          // Turn off device
                devices.schedule(e.device_id, false);
                timerData.dSchedule(e._id);
            }

        }

    });
}
