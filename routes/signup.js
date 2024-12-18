const express = require('express');
const router = express.Router();
const controller = require("../controllers/user");

// Route cho "/"
router.get('/', (req, res) => {
  res.render('signup');
});
router.post("/", controller.signUpUsers);
router.get('/verified', controller.verifyUser);

module.exports = router;