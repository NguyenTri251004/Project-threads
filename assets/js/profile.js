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
