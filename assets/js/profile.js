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

// Xử lý khi nhấn bên ngoài hộp
document.addEventListener("click", function (event) {
    const popupContainer = document.getElementById("popupFollowContainer");

    // Kiểm tra nếu hộp bật lên đang mở và nhấn không nằm trong hộp
    if (popupContainer.style.display === "flex" && !popupContainer.contains(event.target) && event.target.id !== "open-popup-btn") {
        closeFollowPopup();
    }
});
