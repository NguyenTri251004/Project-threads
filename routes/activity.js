const express = require('express');
const router = express.Router();
const controllerLoad = require("../controllers/loadpage");
const controller = require("../controllers/user")

// Route cho "/"
router.get('/', controller.authenticate , controllerLoad.loadActivity);

module.exports = router;