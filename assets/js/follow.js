function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
document.addEventListener('DOMContentLoaded', () => {
    const followButton = document.getElementById('follow-button');
    const followedId = followButton.getAttribute('data-user-id');    
    const followerId = getCookie('userId'); 

    followButton.addEventListener('click', async () => {
        const isFollowing = followButton.dataset.following === 'true';

        const url = isFollowing ? '/follow/unfollowUser' : '/follow/followUser';
        const method = isFollowing ? 'DELETE' : 'POST';
        const body = JSON.stringify({ followerId, followedId });

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (response.ok) {
                if (isFollowing) {
                    followButton.textContent = 'Theo dõi';
                    followButton.dataset.following = 'false';
                } else {
                    followButton.textContent = 'Đang theo dõi';
                    followButton.dataset.following = 'true';
                }
            } else {
                console.error('Lỗi khi xử lý yêu cầu:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi kết nối đến server:', error);
        }
    });
});

//dieu huong toi details
const postDivs = document.querySelectorAll('.container-post');
postDivs.forEach(div => {
    const id_thread = div.dataset.id;
    div.addEventListener('click', async () => {
        window.location.href = `/details/${id_thread}`;
    });
});