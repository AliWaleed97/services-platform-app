const express = require('express');
const router = express.Router();

//redirecting homepage
router.get('/', function(req, res) {
  // res.render('index');
  res.send('Homepage is here');
});

module.exports = router;
