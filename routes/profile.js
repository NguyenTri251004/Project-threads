const express = require('express');
const router = express.Router();
const models = require('../models');
const controllerLoad = require('../controllers/loadpage');
const axios = require('axios'); // Used for uploading to ImgBB

router.get('/', async (req, res) => {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.redirect('/'); 
    }

    try {
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.redirect('/'); 
        }

        const threads = await models.Thread.findAll({
            where: { user_id: userId },
            include: [
                { model: models.Like, as: 'likes-threads' },
                { model: models.Comment, as: 'comments-threads' },
            ],
            order: [['created_at', 'DESC']],
        });

        const formattedThreads = await Promise.all(
            threads.map(async (thread) => {
                const isLiked = await models.Like.findOne({
                    where: { thread_id: thread.id, user_id: userId },
                });

                return {
                    ...thread.toJSON(),
                    isLiked: !!isLiked, 
                };
            })
        );

        const followers = await models.Follow.findAll({
            where: { followed_id: userId },
            include: [{ model: models.User, as: 'Follower' }],
        });

        const following = await models.Follow.findAll({
            where: { follower_id: userId },
            include: [{ model: models.User, as: 'Followed' }],
        });

        res.render('profile', {
            user: user,
            threads: formattedThreads,
            totalFollowers: followers.length,
            totalFollowing: following.length,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.redirect('/'); 
    }
});

const multer = require('multer');

// Cấu hình multer để lưu ảnh vào bộ nhớ (memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Xử lý yêu cầu POST để cập nhật thông tin người dùng
router.post('/update', upload.single('profile-pic'), async (req, res) => {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.redirect('/'); // Nếu chưa đăng nhập, chuyển hướng đến trang login
    }

    try {
        const { name, bio } = req.body;
        let profilePictureUrl = null;

        // Kiểm tra xem có file ảnh được tải lên không
        if (req.file) {
            const imgbbApiKey = 'a05d2c739c5ca3120b2136404be07f46'; // Thay bằng API Key của bạn
            const imageBuffer = req.file.buffer.toString('base64'); // Chuyển file ảnh thành base64
            
            // Gửi ảnh lên ImgBB
            const formData = new FormData();
            formData.append('image', imageBuffer);

            const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: {
                    key: imgbbApiKey,
                },
            });

            // Kiểm tra nếu ImgBB trả về URL hợp lệ
            if (imgbbResponse.data && imgbbResponse.data.data && imgbbResponse.data.data.url) {
                profilePictureUrl = imgbbResponse.data.data.url;
            } else {
                throw new Error('ImgBB không trả về URL hợp lệ.');
            }
        }

        // Tìm người dùng trong cơ sở dữ liệu và cập nhật thông tin
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.redirect('/'); // Nếu không tìm thấy người dùng, chuyển hướng đến trang login
        }

        // Cập nhật thông tin người dùng
        await user.update({
            username: name || user.username,
            bio: bio || user.bio,
            profile_picture: profilePictureUrl || user.profile_picture,
        });

        // Chuyển hướng người dùng về trang profile
        res.redirect('/profile');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        res.redirect('/profile');
    }
});


router.post('/create-thread', upload.single('image'), async (req, res) => {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.redirect('/'); // Nếu chưa đăng nhập, chuyển hướng về trang login
    }

    try {
        const { content } = req.body;
        let imageUrl = null;

        // Kiểm tra xem có ảnh được tải lên không
        if (req.file) {
            const imgbbApiKey = 'a05d2c739c5ca3120b2136404be07f46'; // Thay bằng API Key của bạn
            const imageBuffer = req.file.buffer.toString('base64'); // Chuyển file ảnh thành base64
            
            // Gửi ảnh lên ImgBB
            const formData = new FormData();
            formData.append('image', imageBuffer);

            const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: {
                    key: imgbbApiKey,
                },
            });

            // Kiểm tra nếu ImgBB trả về URL hợp lệ
            if (imgbbResponse.data && imgbbResponse.data.data && imgbbResponse.data.data.url) {
                imageUrl = imgbbResponse.data.data.url; // Lấy URL ảnh từ ImgBB
            } else {
                throw new Error('ImgBB không trả về URL hợp lệ.');
            }
        }

        // Tạo thread mới trong cơ sở dữ liệu
        const newThread = await models.Thread.create({
            user_id: userId,
            content: content || '', // Nếu không có content, sử dụng chuỗi rỗng
            image_url: imageUrl || null, // Nếu không có ảnh, lưu null
            created_at: new Date(),
        });

        // Sau khi tạo thread, chuyển hướng về trang profile
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

router.get('/@:username', controllerLoad.viewProfile);
module.exports = router;
