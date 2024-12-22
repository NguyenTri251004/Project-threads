const buttonPostComment = document.getElementById("buttonPostComment");
const commentInput = document.getElementById("comment");
const threadId = window.location.pathname.split("/").pop();
    buttonPostComment.addEventListener("click", async () => {
    const clearComment = commentInput.value.trim(); 

    if (!clearComment) {
        alert("Bạn chưa nhập nội dung bình luận!");
        return;
    }

    try {
        const response = await fetch("/details/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ clearComment, threadId }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Bình luận gửi thành công!");
            commentInput.value = ""; 
            window.location.reload();
        } else {
            alert(result.message || "Có lỗi xảy ra khi gửi bình luận!");
        }
    } catch (error) {
        console.error("Lỗi khi gửi bình luận:", error);
        alert("Không thể gửi bình luận, vui lòng thử lại sau!");
    }
});


const buttonBack = document.querySelector('.button-back');

if (buttonBack) {
    buttonBack.addEventListener('click', () => {
        window.location.href = '/home';
    });
}