const express = require('express');
const router = express.Router();
const controllerLoad = require("../controllers/loadpage");
const controller = require("../controllers/user")

// Route cho "/details_id"
router.get('/:id_thread', controllerLoad.loadThreadDetails);

router.post('/:id_thread/like', controller.likeThreads);
module.exports = router;