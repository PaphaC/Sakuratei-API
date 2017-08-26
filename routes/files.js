var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var uploadPath = 'public_upload/';
var db = require('mongoose');
var fs = require('fs');

var Account = new db.Schema({
    username: String,
    password: String,
    email: String,
    userToken: String,
});

db.connect('mongodb://localhost/sakuratei');
router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.post('/upload', function(req, res) {
    if(req.body.token) {
        var accountModel = db.model('accounts', Account);
        user = accountModel.find({userToken: req.body.token}, function(err, user){
            if(user.length > 0) {
                console.log('into mongoose findone');
                if (!req.files)
                    return res.status(400).send('No files were uploaded.');

                // Taking the first File of the array
                let uploadedFile = req.files.file;

                var arr_n = uploadedFile.name.split('.');
                var exten = arr_n[arr_n.length - 1];

                var folder = uploadPath + user[0]._doc._id.toString();
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                }

                var fullFilePath = folder + '/' + randomstring.generate() + "." + exten;

                uploadedFile.mv(fullFilePath, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    res.send(JSON.stringify({"path ": fullFilePath}));
                });
            }
        });
    }
});

module.exports = router;
