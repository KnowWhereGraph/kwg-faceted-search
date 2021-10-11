var express = require('express');
const path = require('path');
var router = express.Router();

const P_ENDPOINT = "http://stko-roy.geog.ucsb.edu:7202/sparql";

const P_DIST = path.join(__dirname, '../public/');

router.use('/libraries', express.static(P_DIST+'/libraries'));
router.use('/stylesheets', express.static(P_DIST+'/stylesheets'));
router.use('/javascripts', express.static(P_DIST+'/javascripts'));
router.use('/images', express.static(P_DIST+'/images'));

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'KWG Faceted Search' });
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	res.sendFile(P_DIST + 'views/homepage.html');
});

//****************************************The server code for "full_record_place" mode begin******************************************//
router.get('/full_record_place', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	res.sendFile(P_DIST + 'views/full_record_place.html');
});

//****************************************The server code for "full_record" mode begin******************************************//
router.get('/full_record', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	res.sendFile(P_DIST + 'views/full_record.html');
});

//****************************************The server code for "fullRecord0" mode begin******************************************//
router.get('/fullRecord0', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	res.sendFile(P_DIST + 'views/fullRecord0.html');
});

module.exports = router;
