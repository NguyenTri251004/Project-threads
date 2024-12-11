const express = require('express');
const router = express.Router();
const controller = require("../controllers/user");

// Route cho "/"
// router.get('/', (req, res) => {
//   res.render('home');
// });

router.get('/', controller.loadHome);


module.exports = router;