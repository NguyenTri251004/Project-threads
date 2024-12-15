const controller = {};
const bcrypt = require('bcrypt');
const models = require("../models");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Token } = require('../models'); // Model mới bạn đã định nghĩa
const { Op } = require('sequelize');
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
//xac thuc tai khoan
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

//xac thuc dang nhap
controller.authenticate = (req, res , next) => {
    if (!req.cookies.userId) {
        return res.redirect("/");
    }
    next();
};

controller.sendResetLink = async (req, res) => {
    const { email } = req.body;
  
    try {
        // Kiểm tra email tồn tại
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email không tồn tại." });
        }
      
        // Kiểm tra token tồn tại
        const existingToken = await models.Token.findOne({ where: { email, token_expiry: { [Op.gt]: new Date() } } });
        if (existingToken) {
            return res.status(400).json({ success: false, message: 'Một yêu cầu reset mật khẩu đã được gửi. Vui lòng kiểm tra email.' });
        }

        // Tạo token ngẫu nhiên
        const token = crypto.randomBytes(20).toString('hex');
        const resetLink = `http://localhost:3000/forgot/reset-password/${token}`;

        // Lưu token vào database với thời hạn hiệu lực
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        await models.Token.create({
          email,
          token,
          token_expiry: tokenExpiry,
        });

        // Gửi email
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'vohoangduc3012@gmail.com',
            pass: 'nwyf sgww jjpn ewcd',
          },
        });
      
        const mailOptions = {
          from: 'no-reply@voduc.xyz <vohoangduc3012@gmail.com>',
          to: email,
          subject: 'Đặt lại mật khẩu',
          text: `Click vào link để đặt lại mật khẩu: ${resetLink}`,
        };
      
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email đã được gửi!' });
        return true;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Không thể gửi email.' });
        return false;
      }
      
};

controller.checkToken = async (req, res) => {
    const { token } = req.params;

    // Tìm token trong database
    const tokenData = await models.Token.findOne({ where: { token } });

    if (!tokenData) {
    return res.status(400).send("Token không hợp lệ.");
    }

    // Kiểm tra hạn sử dụng của token
    const now = new Date();
    if (now > tokenData.token_expiry) {
    return res.status(400).send("Token đã hết hạn.");
    }

    // Hiển thị trang đổi mật khẩu
    res.render('reset-password', { email: tokenData.email });
}


controller.resetPassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).send("Mật khẩu không khớp.");
    }
  
    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Cập nhật mật khẩu trong database
    await models.User.update({ password: hashedPassword }, { where: { email } });
  
    // Xóa token sau khi sử dụng
    await models.Token.destroy({ where: { email } });
  
    res.send("Mật khẩu đã được thay đổi thành công.");
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
//like thread
controller.likeThreads = async (req, res) => {
    const threadId = req.params.id_thread;
    console.log(threadId);
    const userId = req.cookies.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập !' });
    }
    try {
        const existingLike = await models.Like.findOne({
            where: { thread_id: threadId, user_id: userId },
        });

        if (existingLike) {
            await existingLike.destroy();

            const totalLikes = await models.Like.count({ where: { thread_id: threadId } });
            return res.json({ liked: false, totalLikes });
        } else {
            await models.Like.create({
                thread_id: threadId,
                user_id: userId,
            });

            const totalLikes = await models.Like.count({ where: { thread_id: threadId } });
            return res.json({ liked: true, totalLikes });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
}
//log out
controller.logOut = (req, res) => {
    res.clearCookie("userId"); 
    res.redirect("/");
};

//comments
controller.commentThreads = async (req, res) => {
    const { clearComment, threadId } = req.body;
    if (!clearComment || clearComment === "") {
        return res.status(400).json({ message: "Nội dung bình luận không được để trống!" });
    }
    if (!threadId) {
        return res.status(400).json({ message: "Không tìm thấy threadId!" });
    }
    const userId = req.cookies.userId;
    await models.Comment.create({
        user_id: userId,
        thread_id: threadId,
        content: clearComment,
    });
    return res.status(200).json({ message: "Bình luận đã được lưu thành công!" });
}

module.exports = controller;