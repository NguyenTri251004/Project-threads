// Hàm mở hộp bật lên
function openFollowPopup() {
    const popupContainer = document.getElementById("popupFollowContainer");
    popupContainer.style.display = "flex"; // Hiển thị hộp
}

// Hàm đóng hộp bật lên
function closeFollowPopup() {
    const popupContainer = document.getElementById("popupFollowContainer");
    popupContainer.style.display = "none"; // Ẩn hộp
}

function openModifyPopup() {
    const popupContainer = document.getElementById("popupModifyContainer");
    popupContainer.style.display = "flex"; // Hiển thị hộp
}

// Hàm đóng hộp bật lên
function closeModifyPopup() {
    const popupContainer = document.getElementById("popupModifyContainer");
    popupContainer.style.display = "none"; // Ẩn hộp
}

// Xử lý khi nhấn bên ngoài hộp
document.addEventListener("click", function (event) {
    const popupFollowContainer = document.getElementById("popupFollowContainer");
    const popupModifyContainer = document.getElementById("popupModifyContainer");
    // Kiểm tra nếu hộp bật lên đang mở và nhấn không nằm trong hộp
    if (popupFollowContainer.style.display === "flex" && !popupFollowContainer.contains(event.target) && event.target.id !== "open-popup-btn") {
        closeFollowPopup();
    }

    if (popupModifyContainer.style.display === "flex" && !popupModifyContainer.contains(event.target) && event.target.id !== "open-popup-modify") {
        closeModifyPopup();
    }
});

function showFollowers() {
    fetch('/profile/getFollowers') 
        .then((response) => response.json())
        .then((data) => {
            const popupFollowBody = document.getElementById('popupFollowBody');
            popupFollowBody.innerHTML = data
                .map(
                    (user) => `
                <div class="follow-item">
                    <div class="follower-profile-pic">
                        <img height="100%" width="100%" alt="" src="${user.profile_picture}">
                    </div>
                    <div class="follower-name">
                        <div class="username">${user.username}</div>
                        <div class="subname">${user.subname}</div>
                    </div>
                    <div class="follow-button" role="button"> Theo dõi bạn </div>
                </div>`
                )
                .join('');
        });
}

function showFollowing() {
    fetch('/profile/getFollowing') 
        .then((response) => response.json())
        .then((data) => {
            const popupFollowBody = document.getElementById('popupFollowBody');
            popupFollowBody.innerHTML = data
                .map(
                    (user) => `
                <div class="follow-item">
                    <div class="follower-profile-pic">
                        <img height="100%" width="100%" alt="" src="${user.profile_picture}">
                    </div>
                    <div class="follower-name">
                        <div class="username">${user.username}</div>
                        <div class="subname">${user.subname}</div>
                    </div>
                    <div class="follow-button" role="button">${user.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</div>
                </div>`
                )
                .join('');
        });
}

//dieu huong toi details
const postDivs = document.querySelectorAll('.container-post');
postDivs.forEach(div => {
    const id_thread = div.dataset.id;
    div.addEventListener('click', async () => {
        window.location.href = `/details/${id_thread}`;
    });
});