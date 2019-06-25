"use strict";

const express = require('express');
const router = express.Router();
const randomstring = require("randomstring");
const db = require('mongoose');
const fs = require('fs');

const conf = require('../conf/conf.json');
const uploadPath = conf.baseDir;

const Account = new db.Schema({
    username: String,
    //password: String,
    //email: String,
    userToken: String,
});

db.connect('mongodb://localhost/sakuratei', {
  useMongoClient: true,
  /* other options */
});
router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/getfiles/:userToken', (req, res) => {
    let folder = uploadPath + req.params.userToken;
    const tab = [];
    fs.readdir(folder, (err, files) => {
        if(err) {
          return res.status(500).send('Token non existant');
        }
        files.forEach(file => {
          tab.push(conf.appFront.baseUrl+ req.params.userToken + '/' + file);
        });
        res.send(JSON.stringify(tab));
    });
});

router.post('/upload', (req, res) => {
    if (req.body.token) {
        let accountModel = db.model('accounts', Account);
        accountModel.find({userToken: req.body.token}, (err, user) => {
            if (user.length > 0) {
                console.log('into mongoose findone');
                if (!req.files) {
                  return res.status(400).send('No files were uploaded.');
                }

                // Taking the first File of the array
                let uploadedFile = req.files.file;

                let arr_n = uploadedFile.name.split('.');
                let exten = arr_n[arr_n.length - 1];
                let folder = uploadPath + user[0].userToken.toString();
                if (!fs.existsSync(folder)){
                    fs.mkdirSync(folder);
                }
                let random = randomstring.generate();
                let fullFilePath = folder + '/' + random + "." + exten;

                uploadedFile.mv(fullFilePath, (err) => {
                    if (err) {
                      return res.status(500).send(err);
                    }
                    const path = {
                        success: true,
                        path2 : fullFilePath,
                        path: conf.appFront.baseUrl + user[0].userToken.toString()+'/'+random+'.'+exten
                    };

                    res.send(path);

                });
            }
        });
    }
});

module.exports = router;
