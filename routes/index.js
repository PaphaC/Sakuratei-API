"use strict";

const accountM = require('../models/accounts');
const express = require('express');
const passport = require('passport');
const randomstring = require("randomstring");
const db = require('mongoose');
const router = express.Router();
const Schema = db.Schema;

db.connect('mongodb://localhost/sakuratai', {
  useMongoClient: true,
  /* other options */
});
const Account = new Schema({
    username: String,
    password: String,
    //email: String,
    userToken: String,
});


router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res) => {
    accountM.register(new accountM({
        username : req.body.username,
        //email : req.body.email,
        password: req.body.password,
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

router.post('/login', (req, res) => {
    let accountModel = db.model('accounts', Account);
    accountModel.find({password: req.body.password, username: req.body.username}, (err, user) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({token: user[0].userToken});
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
