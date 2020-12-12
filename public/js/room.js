
/*  Update the page to display current rooms */
var getRooms = new XMLHttpRequest();
getRooms.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        JSON.parse(getRooms.response).forEach(e => {
            console.log(e);
            var room = "<tr id='"+e._id+"'><th scope='row'>" + e._id + "</th>";
            room 	+= "<th scope='row'>" + e.roomName + "</th><th>";
            room	+= "<a class='waves-effect waves-light btn modal-trigger' href='#edit-room-modal' style='margin-top:10px; margin-right:5px;'><i id='"+e._id+"' class='material-icons' onclick=()>edit</i></button>";
            room	+= "<a class='waves-effect waves-light btn' style='margin-top:10px; margin-right:5px;'><i id='"+e._id+"' class='material-icons' onclick=(DeleteRoom(id))>delete</i></button>";
            room	+= "</th></tr>"

            document.getElementById("roomsBody").innerHTML += room;
        })
    }
};
getRooms.open("GET", "/rooms", true);
getRooms.send();

function addRoom() {
    var adroom = new XMLHttpRequest();
    adroom.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {			
            if(!JSON.parse(adroom.response).exists){
                console.log("New room: " + !JSON.parse(adroom.response).exists)
                newRoomForm.submit();
            }else{
                document.getElementById("warning").innerHTML = "This room already exists.";
            }
        }
    }
    adroom.open("GET", "/roomexists/" + document.getElementById("room").value, true);
    adroom.send();
}

/* Delete Room */
function DeleteRoom(id){
	var c = confirm("Are you sure you want to delete this Room?");
	if(c){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				console.log("Deleted: " + id);
				var elem = document.getElementById(id);
				elem.parentNode.removeChild(elem);
			}
		}
		xhttp.open("POST", "/deleteroom/" + id, true);
		xhttp.send();
	}
}