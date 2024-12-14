const express = require('express');
const router = express.Router();
const controller = require("../controllers/user");
const controllerLoad = require("../controllers/loadpage");

router.get('/', controller.authenticate, controllerLoad.loadSearch);
router.post('/', controller.followUser);
router.delete('/', controller.unFollowUser);

module.exports = router;