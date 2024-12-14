//su kien click tim
document.querySelectorAll('.inner-love').forEach((likeButton) => {
    likeButton.addEventListener('click', function (event) {
        event.stopPropagation();
        const threadId = this.dataset.id;
        likeThreads(threadId, this);
    });
});

//xu ly tim threads
async function likeThreads(threadId, likeDiv) {
    try {
        const response = await fetch(`/details/${threadId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            const likeCount = likeDiv.querySelector('span');
            const likeIcon = likeDiv.querySelector('i');

            if (result.liked) {
                likeIcon.classList.add('fa-solid');
                likeIcon.classList.remove('fa-regular');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            } else {
                likeIcon.classList.add('fa-regular');
                likeIcon.classList.remove('fa-solid');
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            }
        } else {
            alert(result.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi xử lý yêu cầu!');
    }
}