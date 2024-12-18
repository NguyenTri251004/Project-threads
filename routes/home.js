const express = require('express');
const router = express.Router();
const controllerLoad = require("../controllers/loadpage");
const controller = require("../controllers/user");

//route cho home
router.get('/', controller.authenticate, controllerLoad.loadHome);
//route cho home following
router.get('/following' , controller.authenticate, controllerLoad.loadHomeFollowing);

module.exports = router;