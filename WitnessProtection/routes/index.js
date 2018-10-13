var express = require('express');
var router = express.Router();
const adduser = require('../models/adduser');
// const users = require('../routes/users');

var User = require('../models/user');


let wls = require("wlsjs");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

var app = express();



// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	adduser.find({ownerUsername: res.locals.user.username}).then(function(results){
		res.render('index', {favourites: results});
		console.log("\nHello @" + res.locals.user.username + " Welcome to Witness Protection");
	})
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}


module.exports = router;
