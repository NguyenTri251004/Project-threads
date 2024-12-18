document.querySelector('.submit').addEventListener('click', function(event) {
    const email = document.querySelector('.email-user').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Vui lòng nhập email hợp lệ!');
        event.preventDefault();
    }
});


document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    try {
        // Gửi yêu cầu AJAX tới controller
        const response = await fetch('/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        // Hiển thị thông báo
        if (result.success) {
            //alert('Email đã được gửi!');
            messageDiv.style.display = 'block';
            messageDiv.style.color = 'green';
            messageDiv.textContent = result.message;
        } else {
            //alert('Không thể gửi email.');
            messageDiv.style.display = 'block';
            messageDiv.style.color = 'red';
            messageDiv.textContent = result.message;
        }
    } catch (error) {
        console.error(error);
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Có lỗi xảy ra, vui lòng thử lại.';
    }
});