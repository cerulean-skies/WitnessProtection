var express = require('express');
var router = express.Router();

const addcredential = require('../models/user');


router.get('/credentials', ensureAuthenticated, function(req, res){
	addcredential.find({}).then(function(results){
		res.render('credentials', {credentials: results});
		// res.json(results);
	})

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

// Get Homepage
router.post('/createcredential', ensureAuthenticated, function(req, res){
	let newcredential = new addcredential({wlsUsername: req.body.wlsUsername, wlsPostingKey: req.body.wlsPostingKey,
	steemUsername: req.body.steemUsername, steemPostingKey: req.body.steemPostingKey });
  newcredential.save().then(function(result){
    console.log(result);
    res.render('credentials');
  })
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
