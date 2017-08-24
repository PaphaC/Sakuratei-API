var express = require('express');
var router = express.Router();
var http = require('http');




/* GET users listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
});

router.post('/register', function(req, res, next) {
    var user = {
        userName : req.body.username,
        eMail : req.body.email,
        passWord : req.body.pass
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
});

module.exports = router;
