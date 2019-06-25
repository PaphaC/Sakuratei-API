"use strict";

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    //email: String,
    userToken: String,
});

Account.plugin(passportLocalMongoose);


module.exports = mongoose.model('Account', Account);
