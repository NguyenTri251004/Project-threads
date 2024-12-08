const controller = {};
const bcrypt = require('bcrypt');
const models = require("../models");
//dang nhap
controller.loginUsers = async (req, res) => {
    try {
        //mk mac dinh trong db: password1 -> password6 da ma hoa 
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
        const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);
        if (!isPasswordValid) {
            return res.render("index", { errorMessage: "Sai mật khẩu" });
        }
        res.redirect("/");  

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
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error('Có lỗi xảy ra khi đăng ký!', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};

module.exports = controller;