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

    const menuItems = document.querySelectorAll(".inner-home, .inner-sreach, .inner-love-react, .inner-people");

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

window.onload = function() {
    // Lấy trạng thái is_read từ cookie
    const isRead = getCookie("is_read");
    // Chọn phần tử hình tròn đỏ nhỏ
    const unreadIndicator = document.querySelector('.unread-indicator');

    // Nếu thông báo chưa đọc (is_read=false), hiển thị hình tròn đỏ
    if (isRead === "false" && unreadIndicator) {
        unreadIndicator.style.display = "block"; // Hiển thị hình tròn đỏ
    } else {
        unreadIndicator.style.display = "none"; // Ẩn hình tròn đỏ nếu đã đọc
    }
};

// Hàm lấy giá trị cookie
function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}