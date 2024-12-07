const controller = {};
const models = require("../models");

controller.loginUsers = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        if (!email || !password) {
            return res.render("index", { errorMessage: "Vui lòng điền đầy đủ thông tin" });
        }

        const user = await models.User.findOne({ where: { email: email } });

        if (!user) {
            return res.render("index", { errorMessage: "Tài khoản không tồn tại" });
        }

        if (user.password !== password) {
            return res.render("index", { errorMessage: "Sai mật khẩu" });
        }

        res.redirect("/");  

    } catch (error) {
        console.error("Lỗi khi đăng nhập: ", error);
        res.render("index", { errorMessage: "Đã xảy ra lỗi, vui lòng thử lại sau" });
    }
};

module.exports = controller;