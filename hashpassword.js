const bcrypt = require('bcrypt');
const models = require('./models'); 

(async () => {
    const users = await models.User.findAll(); 
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10); 
        user.password = hashedPassword; 
        await user.save(); 
    }
    console.log('Đã mã hóa mật khẩu thành công!');
})();