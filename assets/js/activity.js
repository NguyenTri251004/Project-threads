document.addEventListener("DOMContentLoaded", () => {
    // Lắng nghe sự kiện click trên các nút "Delete"
    const deleteButtons = document.querySelectorAll('.delete');
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const notificationId = event.target.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this notification?")) {
            console.log(notificationId);
          try {
            const response = await fetch(`/activity/delete-notification/${notificationId}`, {
              method: 'DELETE', // Gửi yêu cầu xóa
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log(response.ok);
            if (response.ok) {
              // Nếu xóa thành công, xóa thông báo khỏi giao diện
              event.target.closest('.container-post').remove();
            } else {
              alert("Failed to delete notification.");
            }
          } catch (error) {
            console.error("Error deleting notification:", error);
            alert("An error occurred. Please try again.");
          }
        }
      });
    });
});


