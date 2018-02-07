"use strict";

const express = require('express');
const router = express.Router();
const randomstring = require("randomstring");
const uploadPath = 'public_upload/';
const db = require('mongoose');
const fs = require('fs');

const Account = new db.Schema({
    username: String,
    password: String,
    email: String,
    userToken: String,
});

db.connect('mongodb://localhost/sakuratei');
router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.post('/upload', (req, res) => {
    if (req.body.token) {
        let accountModel = db.model('accounts', Account);
        user = accountModel.find({userToken: req.body.token}, (err, user) => {
            if (user.length > 0) {
                console.log('into mongoose findone');
                if (!req.files) {
                  return res.status(400).send('No files were uploaded.');
                }

                // Taking the first File of the array
                let uploadedFile = req.files.file;

                let arr_n = uploadedFile.name.split('.');
                let exten = arr_n[arr_n.length - 1];

                let folder = uploadPath + user[0]._doc._id.toString();
                if (!fs.existsSync(folder)){
                    fs.mkdirSync(folder);
                }
                let random = randomstring.generate();
                let fullFilePath = folder + '/' + random + "." + exten;

                uploadedFile.mv(fullFilePath, (err) => {
                    if (err) {
                      return res.status(500).send(err);
                    }

                    //res.send(JSON.stringify({"success": "true", "path" : fullFilePath}));
                    res.redirect('http://sakuratai.ga/'+ user[0]._doc._id.toString()+'/'+random+'.'+exten);
                });
            }
        });
    }
});

module.exports = router;
