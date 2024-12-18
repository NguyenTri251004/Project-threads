const express = require('express');
const router = express.Router();
const models = require('../models'); // Import models (nếu cần)
const multer = require('multer'); // Multer để xử lý upload file
const path = require('path');
const dayjs = require('dayjs'); // Import thư viện dayjs
const relativeTime = require('dayjs/plugin/relativeTime'); // Plugin hiển thị thời gian tương đối
dayjs.extend(relativeTime);
const controllerLoad = require('../controllers/loadpage')

router.get('/', async (req, res) => {
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

        // Lấy danh sách thread của người dùng
        const threads = await models.Thread.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: models.Like,
                    as: 'likes-threads',
                },
                {
                    model: models.Comment,
                    as: 'comments-threads',
                },
            ],
            order: [['created_at', 'DESC']], // Sắp xếp theo thời gian tạo giảm dần
        });

        // Tính toán thời gian tương đối
        const formattedThreads = threads.map((thread) => ({
            ...thread.toJSON(),
            timeAgo: dayjs(thread.created_at).fromNow(), // Thêm trường thời gian tương đối
        }));
        //so nguoi follower
        const followers = await models.Follow.findAll({
            where: { followed_id: userId },
            include: [{ model: models.User, as: 'Follower' }],
        });
        //so nguoi following
        const following = await models.Follow.findAll({
            where: { follower_id: userId },
            include: [{ model: models.User, as: 'Followed' }],
        });
        //tinh tong so nguoi follow
        // const totalFollowers = await models.Follow.count({
        //     where: { followed_id: userId },
        // });

        // Truyền thông tin người dùng và threads vào view
        res.render('profile', {
            user: user,
            threads: formattedThreads, // Sử dụng danh sách thread đã thêm thời gian tương đối
            totalFollowers: followers.length,
            totalFollowing: following.length,
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

router.post('/create-thread', upload.single('image'), async (req, res) => {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.redirect('/'); // Chưa đăng nhập, chuyển hướng về trang login
    }

    try {
        const { content } = req.body;
        let imageUrl = null;

        if (req.file) {
            imageUrl = `/assets/image/${req.file.filename}`;
        }

        // Lưu thread mới vào cơ sở dữ liệu
        const newThread = await models.Thread.create({
            user_id: userId,
            content: content || '',
            image_url: imageUrl,
            created_at: new Date(),
        });

        // Sau khi tạo thread thành công, chuyển hướng về trang profile
        res.redirect('/profile');
    } catch (error) {
        console.error('Lỗi khi tạo thread:', error);
        res.redirect('/profile');
    }
});

router.get('/getFollowers', async (req, res) => {
    const userId = req.cookies.userId;
    const followers = await models.Follow.findAll({
        where: { followed_id: userId },
        include: [{ model: models.User, as: 'Follower' }],
    });
    res.json(
        followers.map((f) => ({
            profile_picture: f.Follower.profile_picture,
            username: f.Follower.username,
            subname: f.Follower.subname,
            isFollowing: true,
        }))
    );
});

router.get('/getFollowing', async (req, res) => {
    const userId = req.cookies.userId;
    const following = await models.Follow.findAll({
        where: { follower_id: userId },
        include: [{ model: models.User, as: 'Followed' }],
    });
    res.json(
        following.map((f) => ({
            profile_picture: f.Followed.profile_picture,
            username: f.Followed.username,
            subname: f.Followed.subname,
            isFollowing: true,
        }))
    );
});

router.get('/@:username', controllerLoad.viewProfile)
module.exports = router;
