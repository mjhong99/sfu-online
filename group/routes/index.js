const express = require('express'); // bring express module
const router = express.Router();


/* GET users listing. */
router.get('/channel_page', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
