document.addEventListener('DOMContentLoaded', function() {
e = document.querySelectorAll('.tap-target');
var help = M.TapTarget.init(e, {});
document.getElementById('help').addEventListener("click",()=>{help[0].open();}) 

});