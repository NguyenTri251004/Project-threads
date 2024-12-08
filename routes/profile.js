const express = require('express');
const router = express.Router();
const models = require('../models'); // Import models (nếu cần)

router.get('/', async (req, res) => {
    // Lấy userId từ cookie
    const userId = req.cookies.userId;

    if (!userId) {
        return res.redirect('/'); // Nếu không có userId trong cookie, chuyển hướng đến trang đăng nhập
    }

    try {
        // Truy vấn thông tin người dùng từ cơ sở dữ liệu
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.redirect('/'); // Nếu không tìm thấy người dùng, chuyển hướng đến trang đăng nhập
        }

        // Truyền thông tin người dùng vào view
        res.render('profile', {
            user: user, // Truyền thông tin người dùng vào template
            followersCount: 12, // Bạn có thể thay đổi cách lấy số lượng followers
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.redirect('/'); // Nếu có lỗi, chuyển hướng đến trang đăng nhập
    }
});

module.exports = router;
