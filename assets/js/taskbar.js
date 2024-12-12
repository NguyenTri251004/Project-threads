function showInnerBars() {
    const menu = document.querySelector('.inner-bars-show');
    menu.classList.toggle('active'); 
}
document.addEventListener('click', function (event) {
    const menu = document.querySelector('.inner-bars-show');
    let trigger;
    if (window.innerWidth <= 700) { 
        trigger = document.querySelector('.inner-bars-mobile');
    } else { 
    trigger = document.querySelector('.inner-bars');
    }
    if (!menu.contains(event.target) && !trigger.contains(event.target)) {
    menu.classList.remove('active'); 
    }
});
function showInnerPin() {
    const menu = document.querySelector('.inner-pin-show');
    menu.classList.toggle('active');
}
document.addEventListener('click', function (event) {
const menu = document.querySelector('.inner-pin-show');
let trigger;
trigger = document.querySelector('.inner-pin');
if (!menu.contains(event.target) && !trigger.contains(event.target)) {
    menu.classList.remove('active'); 
}
});

document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.pathname;

    const menuItems = document.querySelectorAll(".inner-home, .inner-sreach, .inner-love, .inner-people");

    menuItems.forEach(function (item) {
        const link = item.querySelector("a"); 
        const icon = item.querySelector("i");  
        
        if (link && (link.getAttribute("href") === currentUrl || currentUrl === '/home/following' && item.classList.contains('inner-home'))) {
            icon.classList.add("text-white");
        } else {
            icon.classList.remove("text-white");
        }
    });
});