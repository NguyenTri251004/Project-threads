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
    console.log(id_thread);
    div.addEventListener('click', async () => {
        window.location.href = `/details/${id_thread}`;
    });
});
// followDivs.forEach(div => {
//     const span = div.querySelector('span'); 
//     const userId = getCookie('userId');
//     const followedId = div.dataset.id;
//     if (span.textContent.trim() === 'Following') {
//         div.classList.add('btn-following');
//     }
//     div.addEventListener('click', async () => {
//         if (span.textContent.trim() === 'Follow') {
//             span.textContent = 'Following'; 
//             div.classList.add('btn-following'); 
//             fetch('/search', {
//               method: 'POST',
//               body: JSON.stringify({
//                   followerId: userId,  
//                   followedId: followedId   
//               }),
//               headers: { 'Content-Type': 'application/json' }
//           });
//         } else {
//             span.textContent = 'Follow'; 
//             div.classList.remove('btn-following'); 
//             fetch('/search', {
//               method: 'DELETE',
//               body: JSON.stringify({
//                   followerId: userId,  
//                   followedId: followedId   
//               }),
//               headers: { 'Content-Type': 'application/json' }
//           });
//         }
//     });
// });