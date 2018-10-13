var express = require('express');
var router = express.Router();

const adduser = require('../models/adduser');


// Get Homepage
router.post('/adduser', ensureAuthenticated, function(req, res){
	let newFavourite = new adduser({username: req.body.username, ownerUsername: res.locals.user.username});
  newFavourite.save().then(function(result){
    console.log(result);
    res.redirect('/');
  })
});

router.post('/removeuser', ensureAuthenticated, function(req, res){

	adduser.findOneAndRemove({username: req.body.username}, function(err){

  })
	res.redirect('/');

});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
