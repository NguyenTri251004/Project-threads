const controller = {};
const bcrypt = require('bcrypt');
const models = require("../models");
const nodemailer = require('nodemailer');

//dang nhap
controller.loginUsers = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanEmail || !cleanPassword) {
            return res.render("index", { errorMessage: "Vui lòng điền đầy đủ thông tin" });
        }

        const user = await models.User.findOne({ where: { email: cleanEmail } });

        if (!user) {
            return res.render("index", { errorMessage: "Tài khoản không tồn tại" });
        }

        if (!user.is_verified) {
            // Gửi lại email xác minh
            const verificationLink = `http://localhost:3000/signup/verified?email=${encodeURIComponent(cleanEmail)}`;
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'vohoangduc3012@gmail.com',
                    pass: 'nwyf sgww jjpn ewcd',
                },
            });

            const mailOptions = {
                from: 'vohoangduc3012@gmail.com',
                to: cleanEmail,
                subject: 'Xác minh tài khoản của bạn',
                text: `Xin chào ${user.username},\n\nTài khoản của bạn chưa được xác minh. Vui lòng nhấp vào liên kết sau để xác minh:\n\n${verificationLink}\n\nTrân trọng,\nĐội ngũ hỗ trợ.`,
            };

            await transporter.sendMail(mailOptions);

            return res.render("index", { errorMessage: "Tài khoản chưa xác minh! Email xác minh đã được gửi lại." });
        }

        const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);

        if (!isPasswordValid) {
            return res.render("index", { errorMessage: "Sai mật khẩu" });
        }

        res.cookie('userId', user.id, { maxAge: 3600000, httpOnly: false });
        res.redirect("/home");

    } catch (error) {
        console.error("Lỗi khi đăng nhập: ", error);
        res.render("index", { errorMessage: "Đã xảy ra lỗi, vui lòng thử lại sau" });
    }
};

//dang ky
controller.signUpUsers = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!username || !cleanEmail || !cleanPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        const existingUser = await models.User.findOne({ where: { email: cleanEmail } });
        const existingUserByUsername = await models.User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng! Hãy dùng Email khác.' });
        }

        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại! Hãy chọn tên khác.' });
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);

        const newUser = new models.User({
            username: username,
            email: cleanEmail,
            subname: username,
            password: hashedPassword,
            is_verified: false, // Tài khoản chưa xác minh
        });

        await newUser.save();

        // Gửi email xác minh
        const verificationLink = `http://localhost:3000/signup/verified?email=${encodeURIComponent(cleanEmail)}`;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vohoangduc3012@gmail.com',
                pass: 'nwyf sgww jjpn ewcd',
            },
        });

        const mailOptions = {
            from: 'vohoangduc3012@gmail.com',
            to: cleanEmail,
            subject: 'Xác minh tài khoản của bạn',
            text: `Xin chào ${username},\n\nVui lòng nhấp vào liên kết sau để xác minh tài khoản của bạn:\n\n${verificationLink}\n\nTrân trọng,\nĐội ngũ hỗ trợ.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.' });
    } catch (error) {
        console.error('Có lỗi xảy ra khi đăng ký!', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};

controller.verifyUser = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).send('Liên kết không hợp lệ!');
    }

    try {
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).send('Tài khoản không tồn tại!');
        }

        if (user.is_verified) {
            return res.send('Tài khoản đã được xác minh trước đó.');
        }

        user.is_verified = true;
        await user.save();

        res.send('Xác minh thành công! Bạn có thể đăng nhập ngay bây giờ.');
    } catch (error) {
        console.error('Lỗi khi xác minh tài khoản:', error);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
};

//load search  
controller.loadSearch = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({ message: "Bạn cần đăng nhập" });
        }

        const users = await models.User.findAll({
            where: { id: { [models.Sequelize.Op.ne]: userId } }
        });

        const following = await models.Follow.findAll({
            where: { follower_id: userId },
            attributes: ['followed_id']
        });
        const followingIds = following.map(f => f.followed_id);
        const userList = users.map(user => ({
            id: user.id,
            name: user.username,
            subname: user.subname,
            ava: user.profile_picture || '/assets/image/pic1.jpg', 
            isFollowing: followingIds.includes(user.id) 
        }));
        res.render('search', { userList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi hệ thống! " });
    }
}
//follow user
controller.followUser = async (req, res) => {
    const { followerId, followedId } = req.body;
    try {
        await models.Follow.create({
            follower_id: followerId,
            followed_id: followedId
        });
        res.status(200).send('Follow thành công!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi follow!');
    }
}
//unfollow user
controller.unFollowUser = async (req, res) => {
    const { followerId, followedId } = req.body;
    try {
        await models.Follow.destroy({
            where: {
                follower_id: followerId,
                followed_id: followedId
            }
        });
        res.status(200).send('Hủy follow thành công!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi hủy follow!');
    }
}

controller.loadHome = async (req , res) => {
    
}
module.exports = controller;