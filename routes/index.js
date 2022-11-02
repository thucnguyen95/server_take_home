var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/:creator_id', function(req, res, next) {
  if (req.params.creator_id === undefined) return res.status(400).send('creator_id required');
  const creatorId = req.params.creator_id;

  var request = http.request({
    host: 'localhost',
    port: 3000,
    path: `/listings/${creatorId}`,
    method: 'GET',
  }, function(response) {
    var data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      res.render('index', JSON.parse(data));
    });
  });
  request.end();
});

module.exports = router;
