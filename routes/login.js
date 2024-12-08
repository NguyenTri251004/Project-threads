const express = require('express');
const router = express.Router();
const controller = require("../controllers/user");

// Route cho "/login"
router.get('/', (req, res) => {
  res.render('index'); 
});
//Route cho post
router.post("/", controller.loginUsers);
module.exports = router;