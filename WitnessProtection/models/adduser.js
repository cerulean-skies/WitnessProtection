const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


// User Schema
var FavouriteSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	votingpower: {
		type: String,
    default:'100'
	},
	numberoftimes: {
		type: String,
    default:'2'

	},
	timetowait: {
		type: String,
    default:'5'

	},
  followers: {
		type: String,
    default:'0'
	},
	ownerUsername: {
		type: String,
		required: true
	}
});

var FavouriteUser = module.exports = mongoose.model('Favourite', FavouriteSchema);


module.exports.createFavouriteUser = function(newFavouriteUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newFavouriteUser.password, salt, function(err, hash) {
	        // newFavouriteUser.password = hash;
	        newFavouriteUser.save(callback);
	    });
	});
}


module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getLoggedInUser = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
