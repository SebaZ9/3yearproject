document.addEventListener('DOMContentLoaded', function () {

    fetch('./devicesget')
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
  
              // Examine the text in the response
                response.json().then(function(devices) {

                    var select = document.querySelectorAll('select')[0];

                    devices.forEach((device)=>{
                        var elem = document.createElement('option');
                        elem.value = device._id;
                        elem.appendChild(document.createTextNode(device.name));
                        select.appendChild(elem);

                    });
                                

                    var dropdown = M.FormSelect.init(select, {});

                        
                    fetch('./getstat')
                    .then(
                        function(response) {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                                return;
                            }
            
                            // Examine the text in the response
                            response.json().then(function(data) {

                              

                                select.addEventListener('change', (e) => {
                                    
                                    var selectedDevices = M.FormSelect.getInstance(select).getSelectedValues();

                                    
                                    google.load('visualization', '1.1', { packages: ['corechart', 'controls'] });
                                    google.setOnLoadCallback(drawVisualization);
    

                                    function drawVisualization() {

                                        var columns = [];
                                        var selectedData = [];
                                        var order = [];

                                        columns.push(['date']);
                                        
                                       
                                        devices.forEach(device=>{
                                            if(selectedDevices.includes(device._id)){
                                                order.push(device._id);
                                                columns[0].push(device.name);
                                            }
                                        });
    
                                        //selecting the correct data
                                        data.forEach((e)=>{
                                            if(selectedDevices.includes(e.device_id)){

                                                var found = false;

                                                for(var i = 0; i < selectedData.length; i++){
                                                    if(selectedData[i].day == e.day && selectedData[i].month == e.month){
                                                        selectedData[i].value.push({power:e.power,id:e.device_id});
                                                        found = true;
                                                    }
                                                }

                                                if(found == false){
                                                    selectedData.push({
                                                        day:e.day,
                                                        month:e.month,
                                                        value:[{power:e.power,id:e.device_id}]//or here
                                                    });
                                                }
                                               
                                            }
                                        });

                                        var rows = [];

                                        //moving it into table format
                                        selectedData.forEach((day)=>{

                                            var date = new Date();
                                            var row = [new Date(date.getFullYear(), day.month, day.day)];

                                            order.forEach((id,i)=>{
                                                row.push(day.value[i].power);
                                            });

                                           
                                            rows.push(row);

                                        });

                                    
                                        function mergeSort (unsortedArray) {
                                            // No need to sort the array if the array only has one element or empty
                                            if (unsortedArray.length <= 1) {
                                                return unsortedArray;
                                            }
                                            // In order to divide the array in half, we need to figure out the middle
                                            const middle = Math.floor(unsortedArray.length / 2);

                                            // This is where we will be dividing the array into left and right
                                            const left = unsortedArray.slice(0, middle);
                                            const right = unsortedArray.slice(middle);

                                            // Using recursion to combine the left and right
                                            return merge(
                                                mergeSort(left), mergeSort(right)
                                            );
                                        }
                                        
                                        // Merge the two arrays: left and right
                                        function merge (left, right) {
                                            let resultArray = [], leftIndex = 0, rightIndex = 0;
                                        
                                            // We will concatenate values into the resultArray in order
                                            while (leftIndex < left.length && rightIndex < right.length) {

                                                if (left[leftIndex][0] < right[rightIndex][0]) {
                                                    resultArray.push(left[leftIndex]);
                                                    leftIndex++; // move left array cursor
                                                } else {
                                                    resultArray.push(right[rightIndex]);
                                                    rightIndex++; // move right array cursor
                                                }
                                            }
                                        
                                            // We need to concat here because there will be one element remaining
                                            // from either left OR the right
                                            return resultArray
                                                    .concat(left.slice(leftIndex))
                                                    .concat(right.slice(rightIndex));
                                        }

                                        /////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!
                                        var rows = mergeSort(rows);
                                        var columns = columns.concat(rows);
                                        
                                        dataTable = google.visualization.arrayToDataTable(columns);
                                       
                                        var options = {
                                            title: 'Power Consumption (Kilo-watt Hours)',
                                            curveType: 'function',
                                            legend: { position: 'bottom' },
                                            explorer: {axis: 'horizontal', keepInBounds: false}
                                        };
                                  
                                        var chart = new google.visualization.LineChart(document.getElementById('chart'));
                                  
                                        document.getElementById('remove').style.display = 'none';
                                        chart.draw(dataTable, options);

                                        //Ignores the first one
                                       
                                    }
    
                                   

                                });
                                            
                                

                                
                                
                            });
                        }

                    );




                                    
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });


});