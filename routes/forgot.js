const express = require('express');
const router = express.Router();
const controller = require("../controllers/user");
// Route cho "/"
router.get('/', (req, res) => {
  res.render('forgot');
});

router.post('/', controller.sendResetLink);

router.get('/reset-password/:token', controller.checkToken);
module.exports = router;