var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var querystring = require('querystring');


var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});


// Register User
router.post('/register', function (req, res) {
	var email = req.body.emailReceiving;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var backupPassword = req.body.passwordBackup;
	var backupPassword2 = req.body.passwordBackup2;
	var ActivePassword = req.body.passwordActive;
	var ActivePassword2 = req.body.passwordBackupActive;

	var mainBrainKey = req.body.mainBrainKey;
	var mainBrainKey2 = req.body.mainBrainKey2;

	var checkRate = req.body.checkRate;
	var threshold = req.body.threshold;
	var accountCreationFee = req.body.accountCreationFee;
	var WitnessLink = req.body.WitnessLink;
	var sendMailLogin = req.body.emailSending;
	var sendMailPassword = req.body.emailSendingPassword;
	var MaximumBlockSize = req.body.MaximumBlockSize;


	// Validation
	req.checkBody('emailReceiving', 'Email is required').notEmpty();
	req.checkBody('emailReceiving', 'Email is not valid').isEmail();

	req.checkBody('emailSending', 'Email is required').notEmpty();
	req.checkBody('emailSending', 'Email is not valid').isEmail();

	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	req.checkBody('passwordBackup', 'Backup Password is required').notEmpty();
	req.checkBody('passwordBackup2', 'Passwords do not match').equals(req.body.passwordBackup);

	req.checkBody('passwordActive', 'Backup Password is required').notEmpty();
	req.checkBody('passwordBackupActive', 'Passwords do not match').equals(req.body.passwordActive);

	req.checkBody('checkRate', 'Check Rate is required').notEmpty();
	req.checkBody('threshold', 'Threshold is required').notEmpty();
	req.checkBody('accountCreationFee', 'Creation Fee is required').notEmpty();
	req.checkBody('WitnessLink', 'Witness Link is required').notEmpty();

	req.checkBody('emailSending', 'Notification Email is required').notEmpty();
	req.checkBody('emailSendingPassword', 'Notification Password is required').notEmpty();



	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						email: email,
						username: username,
						password: password,
						backupPassword: backupPassword,
						ActivePassword: ActivePassword,

						mainBrainKey: mainBrainKey,
						
						checkRate: checkRate,
						threshold: threshold,
						accountCreationFee: accountCreationFee,
						WitnessLink: WitnessLink,
						MaximumBlockSize: MaximumBlockSize,
						sendMailLogin: sendMailLogin,
						sendMailPassword: sendMailPassword
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
var person = {person: "test"};

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

router.get('/credentials', function (req, res) {


	res.render('/credentials');
});

module.exports = router, person;
