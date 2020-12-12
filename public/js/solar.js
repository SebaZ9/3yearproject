document.addEventListener('DOMContentLoaded', function() {
    
    var init = true,buffer=[],curr = 1,slid = true,startDate;

    var e = document.querySelector('.modal');
    var modal = M.Modal.init(e, {});

   
    e = document.querySelectorAll('.timepicker');
    var timepickers = M.Timepicker.init(e, {});

    e = document.getElementsByClassName('carousel')[1];

    var carouselZombie = M.Carousel.init(e, {
        fullWidth: true,
        duration:130
    });

    e = document.getElementsByClassName('carousel')[0]

    var carousel = M.Carousel.init(e, {
        fullWidth: true,
        onCycleTo: function (slide){
            try{
                if(init == false){
                    buffer.push(slide.id);
                    checkSlid();
                }
                init = false;
            } catch {
                console.log("it happened")
                console.log(slide);
                if(init == false){
                    carouselChange(slide.id);
                }
                init = false;
            }            
        }
    });

    function checkSlid(){
        if(slid){
            slid = !slid;
            slideZombie();               
        } else {
            window.setTimeout(checkSlid(), 200);
        }
    }

    function slideZombie(){

        slide = buffer.pop();

        while(slide != curr){
            if(curr == 1 && slide == 12){
                carouselZombie.prev()
                curr=12;
            } else if(curr == 12 && slide == 1) {
                carouselZombie.next();
                curr=1;
    
            } else if(curr < slide){
                carouselZombie.next();
                curr++;
    
            } else {
                carouselZombie.prev();
                curr--;
            }
        }

        curr = slide;
        
        window.setTimeout(function(){
            slid = !slid;
        }, 200);

    }

    function carouselChange(slide){
        
        console.log(curr);
       
        if(curr == 1 && slide == 12){
            carousel.prev()
            
        } else if(curr == 12 && slide == 1) {
            carousel.next();

        } else if(curr < slide){
            carousel.prev();
        } else {
            carousel.next();
        }
        
    }


    e = document.getElementsByClassName('carousel')[0].children;

    e[0].addEventListener("click", ()=>{
        carousel.prev();
    });
    
    e[1].addEventListener("click", ()=>{
        carousel.next();
    });

    var zombie = document.getElementsByClassName('carousel')[1];

    zombie.removeEventListener('mousedown', carouselZombie._handleCarouselTapBound);
    zombie.removeEventListener('mousemove', carouselZombie._handleCarouselDragBound);
    zombie.removeEventListener('mouseup', carouselZombie._handleCarouselReleaseBound);
    zombie.removeEventListener('mouseleave', carouselZombie._handleCarouselReleaseBound);
    zombie.removeEventListener('click', carouselZombie._handleCarouselClickBound);
    zombie.removeEventListener('touchstart', carouselZombie._handleCarouselTapBound);
    zombie.removeEventListener('touchmove', carouselZombie._handleCarouselDragBound);
    zombie.removeEventListener('touchenter', carouselZombie._handleCarouselReleaseBound);
    zombie.removeEventListener('touchleave', carouselZombie._handleCarouselReleaseBound);
    zombie.removeEventListener('touchcancel', carouselZombie._handleCarouselClickBound);
   
    zombie.addEventListener('mouseup',()=>{correctColours()});
    document.getElementsByTagName("BODY")[0].addEventListener('mouseup',()=>{correctColours()});
    

    var months = ['January','Febuary','March','April', 'May', 'June', 'July','August', 'September', 'October','November', 'December'];//days in month
    var data = [];
  
    getData();
   

    function getData(){

        fetch('./solardata/' + new Date().getFullYear())
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function(d) {
                    data = d;

                    data.forEach((month,i)=>{

                        month.data.forEach((day,j)=>{


                            var temp = document.createElement("div");   
                            temp.appendChild(document.createTextNode(j+1));
                            
                            temp.classList.add("box");
                            temp.classList.add("col");
                            temp.classList.add("s3");
                            temp.classList.add("m2");
                            temp.classList.add("l2");
                        
                            temp.addEventListener('mousedown',()=>{startDate = j; dragging = true});
                            temp.addEventListener('mouseup',()=>{loadDates(startDate,j,i)});
                            temp.addEventListener('mouseover',()=>{colourIn(startDate,j,i)});
            
                            zombie.children[i].children[0].children[0].appendChild(temp);


                        });
                    });

                    for(var i =0;i<12;i++){
                        if(data[i] == undefined){

                            zombie.children[i].children[0].children[0].innerHTML = "<h2 style='color:white'>Sorry, no data for this month yet!</h2>";

                        }
                    }

                    correctColours();
                
                });

            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });



    }

    var dragging = false;

    
    function colourIn(start,end,month){

       
        if(dragging){
            

            for(var i = 0; i < zombie.children[month].children[0].children[0].children.length; i++){

                if(between(start,end,i)){

                    zombie.children[month].children[0].children[0].children[i].style.backgroundColor = '#5b8499';
                    zombie.children[month].children[0].children[0].children[i].style.color = '#fff';

                }

            }

        }
    }

    function loadDates(start,end,month){

        correctColours();

        var monthAverage = average(data[month].data);
        var dates = [];
        var total = 0;
       
        data[month].data.forEach((e,i)=>{

            if(between(start,end,i)){
                dates.push(e);
                total += e;
            }

        });
        
        var  datesAverage =  average(dates);

        if(start < end){
            document.getElementById('days').innerHTML = "from the " + (start + 1) + calcEnding(start + 1) + ' to the ' + (end +1) + calcEnding(end + 1)+ ':';          
        } else if(end < start){
            document.getElementById('days').innerHTML = "from the " + (end +1) + calcEnding(end + 1) + ' to the ' + (start +1) + calcEnding(start + 1)+ ':';
        } else {
            document.getElementById('days').innerHTML = "on the " + (start +1) + calcEnding(start + 1)+ ':';
        }

        document.getElementById('total').innerHTML = total + ' kilowatt-hours';

        if(start != end){
            document.getElementById('daysAverage').innerHTML = ', averaging '+ datesAverage + ' kilowatt-hours per day;';
        } else {
            document.getElementById('daysAverage').innerHTML = ','
        }

        document.getElementById('saving').innerHTML = "£" +  Math.round(((total * 0.1437) + Number.EPSILON) * 100) / 100;

        if(datesAverage < monthAverage){
            document.getElementById('diff').innerHTML = 'Sadly, that is ' + (Math.round(((monthAverage - datesAverage) + Number.EPSILON) * 100) / 100) + ' kilowatt-hours less than'
        } else if(datesAverage > monthAverage){
            document.getElementById('diff').innerHTML = 'That is ' + (Math.round(((datesAverage - monthAverage) + Number.EPSILON) * 100) / 100) + ' kilowatt-hours more than'
        } else {
            document.getElementById('diff').innerHTML = 'Exactly equal to';
        }
        
        document.getElementById('monthAverage').innerHTML = monthAverage + " kilowatt-hours."

        document.getElementById('info-card').style.display = 'block';
    }

    function correctColours(){

        dragging = false;

        data.forEach((month,i)=>{

            month.data.forEach((day,j)=>{

            
                var transparency = 1 - day / average(data[i].data);

                zombie.children[i].children[0].children[0].children[j].style.backgroundColor = 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',' + (0.4 - transparency) + ')';
                zombie.children[i].children[0].children[0].children[j].style.color = 'rgba(0, 0, 0, 0.87)';

                if((0.4 - transparency) < 0.5){
                    zombie.children[i].children[0].children[0].children[j].style.color = '#fff';
                }
    


            });
    
        });
        
    }

    
});	


function average(input) {  
    
    var sum = 0;

    input.forEach((e)=>{
        sum += e;
    });
    
    return Math.round((sum/input.length + Number.EPSILON) * 100) / 100;
}

function between(start,end,index){
    if((start <  end && index <= end && start <= index) || ( end < start && index <= start && end <= index) || (end==start && index == end)){
        return true;
    } else return false;
}

function calcEnding(day){
    if(day == 1 || day == 21 || day == 31){
        return 'st';
    } else if(day == 2 || day == 22){
        return 'nd';
    } else if(day == 3 || day == 23){
        return 'rd';
    } else return 'th';
}