/*  Modal event     */
document.addEventListener('DOMContentLoaded', function() {
				
    var el = document.querySelectorAll('.modal');
	var modals = M.Modal.init(el, {preventScrolling:false,outDuration:500});

	var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
});	

for (let i of document.getElementsByClassName('tabs')) {
	var instance = M.Tabs.init(i)
}


/*  Update the page to display current users */
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        JSON.parse(xhttp.response).forEach(e => {
            console.log(e);
            var type = "";
            if (e.admin == true){
                type =  "Admin";
            }else{
                type = "User";
            }
            var user = "<tr id='"+e._id+"'><th scope='row'>" + e._id + "</th>";
            user 	+= "<th scope='row'>" + e.fname + "</th>";
            user 	+= "<th scope='row'>" + e.lname + "</th>";
            user 	+= "<th scope='row'>" + e.username + "</th>";
            user 	+= "<th scope='row'>" + type + "</th><th>";
            user	+= "<a class='waves-effect waves-light btn modal-trigger' href='#edit-user-modal' style='margin-top:10px; margin-right:5px;'><i id='"+e._id+"' class='material-icons' onclick=(EditUpdate(id))>edit</i></button>";
            user	+= "<a class='waves-effect waves-light btn' style='margin-top:10px; margin-right:5px;'><i id='"+e._id+"' class='material-icons' onclick=(Delete(id))>delete</i></button>";
            user	+= "</th></tr>"

            document.getElementById("usersBody").innerHTML += user;
        })
    }
};
xhttp.open("GET", "/accounts", true);
xhttp.send();

/* Delete User */
function Delete(id){
	var c = confirm("Are you sure you want to delete this account?");
	if(c){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				console.log("Deleted: " + id);
				var elem = document.getElementById(id);
				elem.parentNode.removeChild(elem);
			}
		}
		xhttp.open("POST", "/deleteuser/" + id, true);
		xhttp.send();
	}
}
	

/* Modal edit user */
function EditUpdate(id){
	console.log(id);
	document.getElementById("accTypeEdit").hidden = false;
	document.getElementById("accTypeConfirm").hidden = true;
	document.getElementById("accType").hidden = false;
	document.getElementById("accTypeInput").hidden = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			var info = JSON.parse(xhttp.response);
			document.getElementById("accID").innerHTML = info._id;
			document.getElementById("accName").innerHTML = info.fname;
			document.getElementById("accSname").innerHTML = info.lname;
			document.getElementById("accUname").innerHTML = info.username;
			var type;
			info.admin ? type = 'Admin' : type =  'Normal';
			document.getElementById("accType").innerHTML = type;
			document.getElementById("selecttype").innerHTML = type;
		}
	}
	xhttp.open("GET", "/getaccount/" + id, true);
	xhttp.send();
}

/* Change user details */
function EditAccount(value, change) {
	id = document.getElementById('accID').innerHTML;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			console.log(JSON.parse(xhttp.response));
		}
	}
	xhttp.open("POST", "/changeaccount/" + change + "/" + value + "/" + id, true);
	xhttp.send();
}

/* Change visable fields of Edit modal */
function ChangeFields(id){
	switch(id){
		case 0:
			if(document.getElementById("accNameEdit").hidden){
				document.getElementById("fname").value = "";
				document.getElementById("accNameEdit").hidden = false;
				document.getElementById("accNameConfirm").hidden = true;
				document.getElementById("accName").hidden = false;
				document.getElementById("accNameInput").hidden = true;
			}else{
				document.getElementById("accNameEdit").hidden = true;
				document.getElementById("accNameConfirm").hidden = false;
				document.getElementById("accName").hidden = true;
				document.getElementById("accNameInput").hidden = false;
			}	
			break;
		case 1:
			if(document.getElementById("accSnameEdit").hidden){
				document.getElementById("surname").value = "";
				document.getElementById("accSnameEdit").hidden = false;
				document.getElementById("accSnameConfirm").hidden = true;
				document.getElementById("accSname").hidden = false;
				document.getElementById("accSnameInput").hidden = true;
			}else{
				document.getElementById("accSnameEdit").hidden = true;
				document.getElementById("accSnameConfirm").hidden = false;
				document.getElementById("accSname").hidden = true;
				document.getElementById("accSnameInput").hidden = false;
			}	
			break;
		case 2:
			if(document.getElementById("accPassInput").hidden){
				document.getElementById("password1").value = "";
				document.getElementById("password2").value = "";
				document.getElementById("passWarning").hidden = true;
				document.getElementById("accPass").hidden = true;
				document.getElementById("accPassInput").hidden = false;
				document.getElementById("accPassEdit").hidden = true;
				document.getElementById("accPassConfirm").hidden = false;
			}else{
				document.getElementById("accPass").hidden = false;
				document.getElementById("accPassInput").hidden = true;
				document.getElementById("accPassEdit").hidden = false;
				document.getElementById("accPassConfirm").hidden = true;
			}
			break;
		case 3:
			if(document.getElementById("accTypeEdit").hidden){
				document.getElementById("accTypeEdit").hidden = false;
				document.getElementById("accTypeConfirm").hidden = true;
				document.getElementById("accType").hidden = false;
				document.getElementById("accTypeInput").hidden = true;
			}else{
				document.getElementById("accTypeEdit").hidden = true;
				document.getElementById("accTypeConfirm").hidden = false;
				document.getElementById("accType").hidden = true;
				document.getElementById("accTypeInput").hidden = false;
			}			
			break;
	}
}

function CheckPassEdit(){
	if(document.getElementById("password1").value == document.getElementById("password2").value){
		EditAccount(document.getElementById("password1").value, "pass");
		document.getElementById("passWarning").hidden = true;
		console.log("Passwords match");
		ChangeFields(2);
	}else{
		document.getElementById("passWarning").hidden = false;
		console.log("Passwords do not match");
	}
}

/* Modal add user */
function CheckInput(){
	// Check if fname, lname and username are entered.
	var ready = true;
	document.getElementById("warning").innerHTML = "";
	if(document.getElementById("fname").value == ""){
		document.getElementById("warning").innerHTML += "Please insert a name. <br />";
		ready = false;	
	}
	if(document.getElementById("lname").value == ""){
		document.getElementById("warning").innerHTML += "Please insert a surname. <br />";
		ready = false;
	}
	if(document.getElementById("username").value == ""){
		document.getElementById("warning").innerHTML += "Please insert a username. <br />";
		ready = false;
	}
	if(document.getElementById("pass").value == ""){
		document.getElementById("warning").innerHTML += "Please insert a password. <br />";
		ready = false;
	}else{
		if(document.getElementById("pass").value != document.getElementById("pass2").value){
			document.getElementById("warning").innerHTML += "The given passwords do not match";
			ready = false;
		}
	}

    if(ready) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
				//If username doesnt exist in DB then make account				
                if(!JSON.parse(xhttp.response).exists){
					console.log("New account: " + !JSON.parse(xhttp.response).exists)
					newUserForm.submit();
				}else{
					document.getElementById("warning").innerHTML = "The username is already taken.";
				}
            }
        }
        xhttp.open("GET", "/accountexists/" + document.getElementById("username").value, true);
        xhttp.send();
    }
}