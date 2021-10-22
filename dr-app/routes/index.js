var express = require('express');
var router = express.Router();

var path = require('path');

const P_DIST = path.join(__dirname, '../public/');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	res.sendFile(P_DIST + 'views/homepage.html');
});

module.exports = router;
