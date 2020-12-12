var accountType;
document.getElementById("content").innerHTML= '<object class="page" type="text/html" data="Home.html" ></object>';
main();

function main(){

	//localStorage.clear();
    var userDetails = new XMLHttpRequest();
    userDetails.open("GET", "/accountinfo", false);
    userDetails.send();
    accountInfo = JSON.parse(userDetails.responseText);

	localStorage.setItem("accountInfo", JSON.stringify(accountInfo));
	
	var pages = document.getElementsByClassName("content-loader"),links = document.querySelector('.sidenav-links');

	if(accountInfo.admin){ accountType = 'admin' }else if(accountInfo.admin == false) { accountType = 'user' };
	if(accountInfo.accountType){
		accountType = '';
	}
	
	
	document.querySelector('nav').children[0].children[2].addEventListener("click", () => { console.log("TEST3")} );

	switch(accountType){
		case "admin":
			links.classList.add("admin");
			break;
		case "user":
			links.classList.add("user");
			links.removeChild(pages[5].parentNode);
			break;
		default:
			links.classList.add("guest");
			links.removeChild(pages[1].parentNode);
			links.removeChild(pages[1].parentNode);
			links.removeChild(pages[3].parentNode);
			break;
	}


	document.addEventListener('DOMContentLoaded', function() {
		var elems = document.querySelectorAll('.sidenav');
		var instances = M.Sidenav.init(elems, {});

		elems = document.querySelectorAll('.fixed-action-btn');
		instances = M.FloatingActionButton.init(elems, {direction:'bottom'});

		
	});

	for(var i = 0;i<pages.length;i++){

		for(var j = 0;j<pages[i].childNodes.length;j++){

			if(pages[i].childNodes[j].nodeType == Node.TEXT_NODE){

				pages[i].addEventListener("click", loadPage(pages,i,j));

			}
		}
	}

	
	
	


}

function loadPage(...args) {
    return function () {
		if(args.length>1){
			document.getElementById("content").innerHTML= '<object class="page" type="text/html" data="'+ args[0][args[1]].childNodes[args[2]].wholeText + '.html" ></object>';
		} else {
			document.getElementById("content").innerHTML= '<object class="page" type="text/html" data="'+ args[0] + '.html" ></object>';
		}
    };
}

function search(){
	//stub
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function sleep(fun,time){
	setTimeout(function () {
		fun();
	}, time);
}