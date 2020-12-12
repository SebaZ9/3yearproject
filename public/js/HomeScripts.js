
var accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
document.getElementById("userMessage").innerHTML += " " + accountInfo.fname;

document.addEventListener('DOMContentLoaded', function() {

    var d = new Date();
    var h = d.getHours();

    if (h == "0") {
        h = 24;
    }
    if (h < 12) {
        document.getElementById("welcome").innerHTML = "<h4>Goodmorning " + accountInfo.fname + "</h4>";
    }
    if (h >= 12) {
        document.getElementById("welcome").innerHTML = "<h4>Good Afternoon " + accountInfo.fname + "</h4>";
    }


    google.charts.load('current', {'packages':['corechart', 'controls']});
    google.charts.setOnLoadCallback(drawChart);
		function drawChart() {
			var data = google.visualization.arrayToDataTable([

				['Appliance', 'Power Consumption'],
				['Heating', 20],
				['Air Conditioning', 7],
				['Television', 2],
				['Desktop PC', 3],
				['Kettle', 1]
			]);

			var options = {
				title: 'Average Power Consumption This Week By Device',
				pieHole: 0.5,
				colors: ['#0B3954', '#BFD7EA', '#CCDBDC', '#6C698D', '#D4D2D5']
			};

			data2 = google.visualization.arrayToDataTable([
				['Room', 'Power Consumption'],
				['Living Room', 15],
				['Kitchen', 11],
				['Master Bedroom', 5],
				['Bedroom 2', 4],
				['Guest Bedroom', 1]
			]);

			options2 = {
				title: 'Average Power Consumption This Week By Room',
				pieHole: 0.5,
				colors: ['#0B3954', '#828A95', '#CEEAF7', '#C9E4CA', '#BEC5AD']
			};
			var pieChart = new google.visualization.PieChart(document.getElementById('donutchart'));
			pieChart.draw(data, options);

			var pieChart2 = new google.visualization.PieChart(document.getElementById('donutchart2'));
			pieChart2.draw(data2, options2);

          
		}  
    
});	