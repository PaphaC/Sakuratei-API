"use strict";

const Account = require('../models/accounts');
const express = require('express');
const passport = require('passport');
const randomstring = require("randomstring");
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res) => {
    Account.register(new Account({
        username : req.body.username,
        email : req.body.email,
        userToken: randomstring.generate()
    }), req.body.password, (err, account) => {
        if (err) {
            res.send(JSON.stringify({ "error": "Username already in use !" }));
        } else {
            passport.authenticate('local')(req, res, function () {
                res.send(JSON.stringify({"token": account.userToken}));
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('login', { user : req.user });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            res.send(JSON.stringify({"token": user.userToken}));
        });
    })
    (req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
