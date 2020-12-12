var el = document.getElementById('tabs')
var instance = M.Tabs.init(el)
var el2 = document.getElementById('tabsinner')
var instance = M.Tabs.init(el2)
var el3 = document.getElementById('tabsinner2')
var instance = M.Tabs.init(el3)

console.log(document.querySelector("#onat"));

document.addEventListener('DOMContentLoaded', function() {
				
    var e = document.querySelectorAll('.modal');
    var modals = M.Modal.init(e, {preventScrolling:false,outDuration:500});

    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems, {});
});		


var devices = {};
var curDevice;
var dateOptions = {weekday : "short", month : "short", day : "numberic", hour : "numberic", minute : "numeric"};

GetDevices();

async function UpdateDeviceModal(id){
    document.getElementById("curSchedule-display").innerHTML = "";
    document.getElementById("modal_device_name").innerHTML = devices[id].name;
    document.getElementById("modal_device_group").innerHTML = devices[id].grouping;
    var statcolour = document.getElementById("status_colour");
    if(devices[id].status) {
        var status = "Status: ON"
        statcolour.className = "card-panel green lighten-2";
    } else {
        var status = "Status: OFF"
        statcolour.className = "card-panel red lighten-2";
    }
    document.getElementById("modal_device_status").innerHTML = status;

    try {
        const interactions = await GetInteractions(id);
        console.log(interactions);
        document.getElementById("interaction-list").innerHTML = "";
        for(i = 0; i < interactions.length; i++){
            var timeoff = (interactions[i].turn_on == interactions[i].turn_off) ? "-" : FormatDate(interactions[i].turn_off);
            document.getElementById("interaction-list").innerHTML +=
            "<tr><td>" + interactions[i].user_id + "</td><td>" + FormatDate(interactions[i].turn_on) + "</td><td>" + timeoff+ "</td></tr>"
        }
    } catch(err){
        console.log(err);
    }

        GetSchedule(id);


    var toggle = devices[id].status ? "Turn Off" : "Turn On";
    document.getElementById("modal_device_toggle").innerHTML = toggle;
    curDevice = id;
}

function UpdateAddDeviceModal(){
    document.getElementById("rooms").innerHTML = "<h5>Rooms</h5>";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            JSON.parse(xhttp.response).forEach(e => {
                document.getElementById("rooms").innerHTML += "<p><label><input name='group1' id="+e.roomName+" type='radio' /><span>"+e.roomName+"</span></label></p>";
            })
        }
    };
    xhttp.open("GET", "/rooms", true);
    xhttp.send();
}

function FormatDate(date){
    var day = date.slice(5,7);
    var month = date.slice(8,10);
    var hour = date.slice(11,13);
    var minute = date.slice(14,16);
    
    return hour + ":" + minute + " - " + day + "/" + month;
}

function GetInteractions(id){
    return $.ajax({
        type : "GET",
        url : "interaction/" + id,
        dataType : "json",
        success: (data, textStatus, xhr) => {  
            console.log("Success Interaction Get");
        },  
        error: (xhr, textStatus, errorThrown) => {  
            console.log(xhr);  
            console.log(textStatus);  
            console.log(errorThrown);
        }  
    });
};

function GetSchedule(id){
    $.ajax({
        type : "GET",
        url : "/timerid/" + id,
        dataType : "json",
        success: (data, textStatus, xhr) => {  
            data.forEach(e => {
                document.getElementById("curSchedule-display").innerHTML +=
            "<tr><td>" + FormatDate(e.startdate) + "</td><td>" + FormatDate(e.enddate) + "</td></tr>"
            })
        },  
        error: (xhr, textStatus, errorThrown) => {  
            console.log(xhr);  
            console.log(textStatus);  
            console.log(errorThrown);
        }  
    });
};

function Submit(){
    var roomObj;
    document.getElementById("rooms").group1.forEach(e => {
        console.log(e);
        if(e.checked){
            roomObj = e.id;
        }
    });
    var obj = {
        name : document.getElementById("device_name").value,
        grouping : roomObj,
        powerusage : document.getElementById("device_pusage").value
    };
    
    console.log(obj);

    $.ajax({
        type : "POST",
        url : "devicesadd",
        dataType : "json",
        data : obj,
        success: (data, textStatus, xhr) => {  
            console.log("Success Add of: " + data._id); 
            devices[data._id] = data;
            document.getElementById("devices-list").innerHTML +=
                "<tr id='" + data._id + "' class='modal-trigger' onclick='UpdateDeviceModal(id)' href='#manage-device-modal'><td>" + obj.name + "</td><td>" + obj.grouping + "</td><td>" + obj.powerusage + "</td></tr>"
         },  
         error: (xhr, textStatus, errorThrown) => {  
            console.log(xhr);  
            console.log(textStatus);  
            console.log(errorThrown);
         }  
    });
};

function ToggleStatus(){
    console.log(devices[curDevice].status);
    var status = devices[curDevice].status ? 0 : 1; 
    $.ajax({
        type : "POST",
        url : "devicetoggle/" + curDevice + "/" + status,
        success: (data, textStatus, xhr) => {
            if(devices[curDevice].status){
                console.log("Setting id: " + curDevice + " to off");
                $.ajax({
                    type : "POST",
                    url : "interactionupdate",
                    dataType : "json",
                    data : {
                        device_id : curDevice,
                    },
                    success: (data, textStatus, xhr) => {
                        console.log("Updating interaction");
                    },
                    error: (xhr, textStatus, errorThrown) => {
                        console.log(xhr);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
                devices[curDevice].status = false;
            }else{
                console.log("Setting id: " + curDevice + " to on");
                console.log(JSON.parse(localStorage.getItem("accountInfo")).username)
                $.ajax({
                    type : "POST",
                    url : "/interaction",
                    dataType : "json",
                    data : {
                        device_id : curDevice,
                        name : JSON.parse(localStorage.getItem("accountInfo")).username
                    },
                    success: (data, textStatus, xhr) => {
                        console.log("Adding new interaction");
                    },
                    error: (xhr, textStatus, errorThrown) => {
                        console.log(xhr);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
                devices[curDevice].status = true;
            }
        },
        error: (xhr, textStatus, errorThrown) => {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
};

function RemoveDevice(){
    console.log("removing device : " + curDevice);
    $.ajax({
        type : "POST",
        url : "devicesremove/" + curDevice,
        success: (data, textStatus, xhr) => {
            console.log("Removed object with id: " + curDevice);
            var elem = document.getElementById(curDevice);
            elem.parentNode.removeChild(elem);
        },
        error: (xhr, textStatus, errorThrown) => {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
};

function GetDevices(){
    $.ajax({
        type : "GET",
        url : "devicesget",
        dataType : "json",
        success: (data, textStatus, xhr) => {  
            console.log("Success Get");
            for(var i = 0; i < data.length; i++){
                devices[data[i]._id] = data[i];
                document.getElementById("devices-list").innerHTML +=
                "<tr id='" + data[i]._id + "' class='modal-trigger' onclick='UpdateDeviceModal(id)' href='#manage-device-modal'><td>" + data[i].name + "</td><td>" + data[i].grouping + "</td><td>" + data[i].powerusage + "</td></tr>"
            }
         },  
         error: (xhr, textStatus, errorThrown) => {  
            console.log(xhr);  
            console.log(textStatus);  
            console.log(errorThrown);
         }  
    });
};

function curTimePlus(hour, minute, date) {
    var noDays = [31,28,31,30,31,30,31,31,30,31,30,31]
    var curDate = date

    var seconds = curDate.getSeconds();
    var minutes = curDate.getMinutes() + minute;
    var hours = curDate.getHours() + hour;
    var date = curDate.getDate();
    var months = (curDate.getMonth());
    var years = curDate.getFullYear();
    if (minutes >= 60) {
        hours += Math.floor(minutes/60);
        minutes = minutes%60;
    }
    if (hours >= 24) {
        date += Math.floor(hours/24);
        hours = hours%24;
    }
    if (date > noDays[months]){
        months += Math.floor(date/noDays[months]);
        date = date%noDays[months];
    }
    if (months > 12){
        years += Math.floor(months/12);
        months = months%12;
    }
    return new Date(years, months, date, hours, minutes, seconds);
}

function translateTimeOn(timeOn) {
    var noDays = [31,28,31,30,31,30,31,31,30,31,30,31]
    var curDate = new Date()

    var seconds = curDate.getSeconds();
    var minutes = parseInt(timeOn.substr(3, 2));
    var hours = parseInt(timeOn.substr(0, 2));
    if (timeOn.substr(6, 2) == "PM" && hours != 12){
        hours += 12;
    }
    if (timeOn.substr(6, 2) == "AM" && hours == 12){
        hours = 00;
    }
    var date = curDate.getDate();
    if (hours < curDate.getHours()){
        date++;
    }
    if (hours == curDate.getHours() && minutes < curDate.getMinutes()){
        date++;
    }
    var months = (curDate.getMonth()+1);
    var years = curDate.getFullYear();
    if (date > noDays[months-1]){
        months += Math.floor(date/noDays[months-1]);
        date = date%noDays[months-1];
    }
    if (months > 12){
        years += Math.floor(months/12);
        months = months%12;
    }
    return new Date(years, months, date, hours, minutes, seconds);
}

function translateTimeOff(timeOff, turnOn) {
    var noDays = [31,28,31,30,31,30,31,31,30,31,30,31]
    var curDate = turnOn

    var seconds = curDate.getSeconds();
    var minutes = parseInt(timeOff.substr(3, 2));
    var hours = parseInt(timeOff.substr(0, 2));
    if (timeOff.substr(6, 2) == "PM" && hours != 12){
        hours += 12;
    }
    if (timeOff.substr(6, 2) == "AM" && hours == 12){
        hours = 00;
    }
    var date = curDate.getDate();
    if (hours < curDate.getHours()){
        date++;
    } else if (hours == curDate.getHours() && minutes < curDate.getMinutes()){
        date++;
    }
    if (hours < parseInt((document.getElementById("onattime").value).substr(0, 2))){
        date++;
    } else if (hours == parseInt((document.getElementById("onattime").value).substr(0, 2)) && minutes < parseInt((document.getElementById("onattime").value).substr(3, 2))){
        date++;
    }

    var months = (curDate.getMonth());
    var years = curDate.getFullYear();
    if (date > noDays[months]){
        months += Math.floor(date/noDays[months]);
        date = date%noDays[months];
    }
    if (months > 12){
        years += Math.floor(months/12);
        months = months%12;
    }
    return new Date(years, months, date, hours, minutes, seconds);
}
function isDateValid(d){
    if (isNaN(d.getTime())) {
        return false
    } else {
        return true
    }
}
function SendSchedule(){
    var turnOn;
    var turnOff;
    var curDate = new Date()
    if (document.getElementById("onatactive").className == "active"){
        turnOn = translateTimeOn(document.getElementById("onattime").value);
    } else if (document.getElementById("oninactive").className == "active") {
        var starthour = parseInt(document.getElementById("oninhours").value)
        var startminute = parseInt(document.getElementById("oninminutes").value)
        if (isNaN(starthour) && !(isNaN(startminute))) starthour = 0
        if (isNaN(startminute) && !(isNaN(starthour))) startminute = 0
        turnOn = curTimePlus(starthour,startminute, curDate)
    }
    
    if (document.getElementById("offatactive").className == "active"){
        turnOff = translateTimeOff(document.getElementById("offattime").value, turnOn);
    } else if (document.getElementById("offinactive").className == "active") {
        if (document.getElementById("oninactive").className == "active"){
            var endhour = parseInt(document.getElementById("offinhours").value)
            var endminute = parseInt(document.getElementById("offinminutes").value)
        }
        else {
            var endhour = parseInt(document.getElementById("offinhours").value)
            var endminute = parseInt(document.getElementById("offinminutes").value)
        }
        if (isNaN(endhour)) endhour = 0;
        if (isNaN(endminute)) endminute = 0;
        //if (isNaN(endhour) && !(isNaN(endminute))) endhour = 0
        //if (isNaN(endminute) && !(isNaN(endhour))) endminute = 0
        turnOff = curTimePlus(endhour, endminute, turnOn)
    }
    
    if(!isDateValid(turnOn)) turnOn = new Date()
    if(!isDateValid(turnOff)) turnOff = new Date()
    console.log(turnOn);
    console.log(turnOff);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("curSchedule-display").innerHTML += "<tr><td>" + turnOn + "</td><td>" + turnOff + "</td></tr>"
    }};
    xhttp.open("POST", "/timerTest/"+curDevice+"/"+turnOn+"/"+turnOff, true);
    xhttp.send();

}