var express = require('express');
const path = require('path');
var router = express.Router();

const P_ENDPOINT = "http://stko-roy.geog.ucsb.edu:7202/sparql";

const P_DIST = path.join(__dirname, '../../public/');

router.use('/libraries', express.static(P_DIST+'/libraries'));
router.use('/stylesheets', express.static(P_DIST+'/stylesheets'));
router.use('/javascripts', express.static(P_DIST+'/javascripts'));
router.use('/images', express.static(P_DIST+'/images'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
