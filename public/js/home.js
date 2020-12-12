document.addEventListener('DOMContentLoaded', function() {
    var accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    var username = accountInfo.fname;
    var enegyCost = 0.1437;
    if (username == null) username = "Guest"

    var d = new Date();
    var h = d.getHours();

    if (h == "0") {
        h = 24;
    }
    if (h < 12) {
        document.getElementById("welcome").innerHTML = "<h4>Goodmorning " + username + "!</h4>";
    }
    if (h >= 12) {
        document.getElementById("welcome").innerHTML = "<h4>Good Afternoon " + username + "!</h4>";
    }

    google.charts.load('current', {'packages':['corechart', 'controls']});
    google.charts.setOnLoadCallback(drawCharts);          

    devices();
    climate();
    solar();


    function devices(){
        fetch('./devicesget')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
  
              // Examine the text in the response
                response.json().then(function(data) {

                    var devicesOn = 0, powerUsage = 0;

                    data.forEach((e)=>{

                        if(e.status){
                            devicesOn++;
                            powerUsage += e.powerusage;
                        }

                    });

                    document.getElementById('numberOfDevices').innerHTML = devicesOn;

                    document.getElementById('powerUsage').innerHTML = powerUsage + " kilowatt-hours";

                    document.getElementById('cost').innerHTML = '£' + Math.round(((powerUsage * enegyCost) + Number.EPSILON));


            
                });

              
  
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

    }

    function climate(){

        fetch('./getclimate/5ea0e2fd4ba59a25c83a2c55')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
  
              // Examine the text in the response
                response.json().then(function(data) {

                    if(data.status){
                        document.getElementById('airCon').innerHTML = 'active.';
                    } else {
                        document.getElementById('airCon').innerHTML = 'disabled.';
                    }

                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

        fetch('./getclimate/5ea0e26c00abba3704af01d6')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
  
              // Examine the text in the response
                response.json().then(function(data) {

                    if(data.status){
                        document.getElementById('heating').innerHTML = 'on.';
                    } else {
                        document.getElementById('heating').innerHTML = 'off.';
                    }

                
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });


    }

    function solar(){

        fetch('./solardata/')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
  
              // Examine the text in the response
                response.json().then(function(data) {

                    var date = new Date(), energy;
                    var dates = [];

                    for(var i = 0; i<data.length;i++){
                        if(data[i].year == date.getFullYear()){
                            dates.push(data[i]);
                        }
                    }

                    data = dates;

                    energy = data[date.getMonth()].data[date.getDate()];

                    document.getElementById('power').innerHTML = energy + ' kilo-watt hours today,';
                    document.getElementById('savings').innerHTML = '£' + Math.round(((energy * enegyCost) + Number.EPSILON)) +"!";

                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

    }
   
    function drawCharts() {

        fetch('./devicesget')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
  
              // Examine the text in the response
                response.json().then(function(data) {
                          
                    var rooms=[];
                    var roomsData=[];

                    var chartData = [['Appliance', 'Power Consumption']];
                    var chartData2 = [['Room', 'Power Consumption']]

                    data.forEach(e => {
                        chartData.push([e.name,e.powerusage]);
                    });

                    data.forEach((e) => {

                        if(rooms.includes(e.grouping)){
                            roomsData[rooms.indexOf(e.grouping)] += e.powerusage;
                        } else {
                            roomsData.push(e.powerusage);
                            rooms.push(e.grouping);
                        }

                    });

                    rooms.forEach((e,i)=>{
                        chartData2.push([rooms[i],roomsData[i]]);
                    });

                    var options = {
                        title: 'Average Power Consumption This Week By Device',
                        pieHole: 0.5,
                        colors: ['#0B3954', '#BFD7EA', '#CCDBDC', '#6C698D', '#D4D2D5']
                    };

                    options2 = {
                        title: 'Average Power Consumption This Week By Room',
                        pieHole: 0.5,
                        colors:  ['#0B3954', '#BFD7EA', '#CCDBDC', '#6C698D', '#D4D2D5']
                    };

                
                    var pieChart = new google.visualization.PieChart(document.getElementById('donutchart'));
                    pieChart.draw(google.visualization.arrayToDataTable(chartData), options);

                    var pieChart2 = new google.visualization.PieChart(document.getElementById('donutchart2'));
                    pieChart2.draw(google.visualization.arrayToDataTable(chartData2), options2);

            
                });

              
  
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

    }  
    
    
});	