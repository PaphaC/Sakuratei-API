var express = require('express');
var passport = require('passport');
var Account = require('../models/accounts');
var randomstring = require("randomstring");
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, email : req.body.email, userToken:  randomstring.generate()}), req.body.password, function(err, account) {
        if (err) {
            res.send(JSON.stringify({ "error": "Username already in use !" }));
        } else {
            passport.authenticate('local')(req, res, function () {
                res.send(JSON.stringify({"token": account.userToken}));
            });
        }
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.send(JSON.stringify({"token": user.userToken}));
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;