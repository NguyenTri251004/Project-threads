document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const username = document.querySelector('.sign-up-user').value;
    const email = document.querySelector('.email-user').value;
    const password = document.querySelector('.sign-up-password').value;
    const confirmPassword = document.querySelector('.confirm-sign-up-password').value;

    const errorMessage = document.getElementById('error-message');

    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Mật khẩu và xác nhận mật khẩu không khớp!';
        return;
    }
    errorMessage.style.display = 'none';
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (result.success) {
            alert('Đăng ký thành công!');
            window.location.href = '/signup'; 
        } else {
            alert(result.message || 'Đăng ký thát bại.');
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});