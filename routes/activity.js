const express = require('express');
const router = express.Router();

// Route cho "/"
router.get('/', (req, res) => {
  res.render('activity');
});

module.exports = router;