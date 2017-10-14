var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express, fuck u.' });
});

module.exports = router;

// db.createUser({user:"root",pwd:"123456",roles:[{role:"dbOwner",db:"test"}]})
// db.goods.insert({"user":"Steve","pid":"101","name":"mi6"})