const express = require('express');
const router = express.Router();
const controller = require("../controllers/loadpage");

// Route cho "/details_id"
router.get('/:id_thread', controller.loadThreadDetails);

module.exports = router;