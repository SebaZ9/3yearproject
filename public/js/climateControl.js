var mon_slider = document.getElementById('monday-slider');
var tues_slider = document.getElementById('tuesday-slider');
var wed_slider = document.getElementById('wednesday-slider');
var thurs_slider = document.getElementById('thursday-slider');
var fri_slider = document.getElementById('friday-slider');
var sat_slider = document.getElementById('saturday-slider');
var sun_slider = document.getElementById('sunday-slider');
var selection;

document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('select');
	var instances = M.FormSelect.init(elems);
	elems.forEach(function(el) {
		$(el).on('change', updateAction)
	})

	function updateAction() {
		selection = $(this).val();
		Update();
	}

	selection = $(elems[0]).val();
	console.log(selection)

	function ToggleButtons(val){
		if(val){
			document.getElementById("offBtn").classList.remove("disabled")
			document.getElementById("onBtn").classList.add("disabled")
		}else{
			document.getElementById("onBtn").classList.remove("disabled")
			document.getElementById("offBtn").classList.add("disabled")		
		}
	}

	function Update(){
		var climate;
		if(selection == 1){
			climate = heatingID;
		}else{
			climate = acID;
		}
		var dataGet = new XMLHttpRequest();
		dataGet.open("GET", "/getclimate/"+climate, false);
		dataGet.send();
		sData = JSON.parse(dataGet.responseText);
		ToggleButtons(sData.status);
		mon_slider.noUiSlider.set([sData.monday.off, sData.monday.on]);
		tues_slider.noUiSlider.set([sData.tuesday.off, sData.tuesday.on]);
		wed_slider.noUiSlider.set([sData.wednesday.off, sData.wednesday.on]);
		thurs_slider.noUiSlider.set([sData.thursday.off, sData.thursday.on]);
		fri_slider.noUiSlider.set([sData.friday.off, sData.friday.on]);
		sat_slider.noUiSlider.set([sData.saturday.off, sData.saturday.on]);
		sun_slider.noUiSlider.set([sData.sunday.off, sData.sunday.on]);
	}

	var climate;
	if(selection == 1){
		climate = heatingID;
	}else{
		climate = acID;
	}
	var dataGet = new XMLHttpRequest();
	dataGet.open("GET", "/getclimate/"+climate, false);
	dataGet.send();
	data = JSON.parse(dataGet.responseText);
	ToggleButtons(data.status);

	//CREATING SLIDERS	
	noUiSlider.create(mon_slider, {
		start: [data.monday.off, data.monday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});
	
	noUiSlider.create(tues_slider, {
		start: [data.tuesday.off, data.tuesday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});
	
	noUiSlider.create(wed_slider, {
		start: [data.wednesday.off, data.wednesday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});
		
	noUiSlider.create(thurs_slider, {
		start: [data.thursday.off, data.thursday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});

	noUiSlider.create(fri_slider, {
		start: [data.friday.off, data.friday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});
	
	noUiSlider.create(sat_slider, {
		start: [data.saturday.off, data.saturday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});

	noUiSlider.create(sun_slider, {
		start: [data.sunday.off, data.sunday.on], //starting position
		connect: true, //duration so handles connected
		step: 0.25, //steps handle in 15min intervals
		tooltips: false,
		range: { 'min': 0, 'max': 24 },
		pips: { mode: 'count', density: 4, values: 5, stepped: true }
	});
			
			
	//FORMAT TIME METHOD 

	function ValToTime(val){
		var hours = Math.floor(val)
		var min;
		switch(val - hours){
			case 0:
				min = "00";
				break;
			case 0.25:
				min = "15";
				break;
			case 0.5:
				min = "30";
				break;
			case 0.75:
				min = "45"
				break;
		}
		return hours + ":" + min;
	}

	//SETTING LABELS BELOW SLIDER
	//MONDAY
	mon_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeMon").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeMon").innerHTML = ValToTime(values[1])
	});


	//TUESDAY
	tues_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeTues").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeTues").innerHTML = ValToTime(values[1])
	});

	//WEDNESDAY
	wed_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeWed").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeWed").innerHTML = ValToTime(values[1])
	});


	//THURSDAY 
	thurs_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeThurs").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeThurs").innerHTML = ValToTime(values[1])
	});

	//FRIDAY 
	fri_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeFri").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeFri").innerHTML = ValToTime(values[1])
	});

	//SATURDAY 
	sat_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeSat").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeSat").innerHTML = ValToTime(values[1])
	});

	//SUNDAY 
	sun_slider.noUiSlider.on('update', function (values) {
		document.getElementById("startTimeSun").innerHTML = ValToTime(values[0])
		document.getElementById("finishTimeSun").innerHTML = ValToTime(values[1])
	});  
	
});

var acID = '5ea0e2fd4ba59a25c83a2c55';
var heatingID = '5ea0e26c00abba3704af01d6';

$("#UpdateButton").click(function(){ 

	var climate;
	if(selection == 1){
		climate = heatingID;
	}else{
		climate = acID;
	}

	$.ajax({
		type: "POST",
		url: "/updateclimate",
		data: {
			"monOn" : mon_slider.noUiSlider.get()[1],
			"monOff" : mon_slider.noUiSlider.get()[0],
			"tuesOn" : tues_slider.noUiSlider.get()[1],
			"tuesOff" :tues_slider.noUiSlider.get()[0],
			"wedOn" : wed_slider.noUiSlider.get()[1],
			"wedOff" : wed_slider.noUiSlider.get()[0],
			"thurOn" : thurs_slider.noUiSlider.get()[1],
			"thurOff" : thurs_slider.noUiSlider.get()[0],
			"friOn" : fri_slider.noUiSlider.get()[1],
			"friOff" : fri_slider.noUiSlider.get()[0],
			"satOn" : sat_slider.noUiSlider.get()[1],
			"satOff" : sat_slider.noUiSlider.get()[0],
			"sunOn" : sun_slider.noUiSlider.get()[1],
			"sunOff" : sun_slider.noUiSlider.get()[0],
			"_id" : climate
		},
		success: function(data, textStatus, jqXHR){
			console.log(data);
	    },
		dataType: "json"
	  });	  
  });

function SetDevice(val){
	var climate;
	if(selection == 1){
		climate = heatingID;
	}else{
		climate = acID;
	}
	var dataGet = new XMLHttpRequest();
	dataGet.open("POST", "/climateToggle/"+climate+"/"+val, false);
	dataGet.send();
	if(val){
		document.getElementById("offBtn").classList.remove("disabled")
		document.getElementById("onBtn").classList.add("disabled")
	}else{
		document.getElementById("onBtn").classList.remove("disabled")
		document.getElementById("offBtn").classList.add("disabled")		
	}
}