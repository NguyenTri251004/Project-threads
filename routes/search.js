const express = require('express');
const router = express.Router();
const controller = require("../controllers/user");

// Route cho "/"
// router.get('/', (req, res) => {
//   res.render('search');
// });

router.get('/', controller.loadSearch);
router.post('/', controller.followUser);
router.delete('/', controller.unFollowUser);

module.exports = router;