
function loginFailed() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login"); 
    xhr.onload = function(event){ 
        alert("Success, server responded with: " + event.target.response); // raw response
    }; 
    var formData = new FormData(document.getElementById("myForm")); 
    xhr.send(formData);
}