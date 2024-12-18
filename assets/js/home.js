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

//dieu huong toi details
const postDivs = document.querySelectorAll('.container-post');
postDivs.forEach(div => {
    const id_thread = div.dataset.id;
    div.addEventListener('click', async () => {
        window.location.href = `/details/${id_thread}`;
    });
});
