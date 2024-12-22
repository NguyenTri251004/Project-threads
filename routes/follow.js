const express = require('express');
const router = express.Router();
const controller = require("../controllers/user")

// Route cho "/"
router.post('/followUser', controller.followUser);
router.delete('/unfollowUser', controller.unFollowUser);

module.exports = router;