const express = require('express');
const router = express.Router();
const controller = require("../controllers/user")
// Route cho "/"
router.get('/', (req, res) => {
  res.render('reset-password');
});

router.post('/', controller.resetPassword);
module.exports = router;