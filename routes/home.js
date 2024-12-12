const express = require('express');
const router = express.Router();
const controller = require("../controllers/loadpage");

//route cho home
router.get('/', controller.loadHome);
//route cho home following
router.get('/following' , controller.loadHomeFollowing);

module.exports = router;