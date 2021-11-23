const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const P_DIST = path.join(__dirname, '../public/');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	res.sendFile(P_DIST + 'views/homepage.html');
});

router.get('/getConfig', function (req, res, next) {
	fs.readFile(P_DIST + 'config.json', function(err, data) {
		res.send(data);
	})
});

module.exports = router;
