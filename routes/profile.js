const express = require('express');
const router = express.Router();
const models = require('../models'); // Import models (nếu cần)
const multer = require('multer'); // Multer để xử lý upload file
const path = require('path');


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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/image'); // Thư mục lưu file ảnh
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/update', upload.single('profile-pic'), async (req, res) => {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.redirect('/'); // Chưa đăng nhập, chuyển hướng về trang login
    }

    try {
        const { name, bio } = req.body;
        let profilePicturePath = null;

        if (req.file) {
            profilePicturePath = `/assets/image/${req.file.filename}`;
        }

        // Tìm và cập nhật người dùng
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.redirect('/'); // Nếu không tìm thấy người dùng, chuyển hướng login
        }

        await user.update({
            username: name || user.username,
            bio: bio || user.bio,
            profile_picture: profilePicturePath || user.profile_picture,
        });

        res.redirect('/profile'); // Chuyển về trang profile sau khi cập nhật
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        res.redirect('/profile');
    }
});


module.exports = router;
