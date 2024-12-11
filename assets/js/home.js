//lam noi bat phan following
document.addEventListener("DOMContentLoaded", function() {
    const forYou = document.querySelector(".filter .for-you");
    const following = document.querySelector(".filter .following");
    const currentPath = window.location.pathname;
    if (currentPath === "/home/following") {
        following.classList.add("active");
    } else {
        forYou.classList.add("active");
    }
});