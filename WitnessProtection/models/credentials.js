var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var credentialSchema = mongoose.Schema({
	wlsUsername: {
		type: String,
		index:true
	},
	wlsPostingKey: {
		type: String
	},
	steemUsername: {
		type: String
	},
	steemPostingKey: {
		type: String
	},
	ownerUsername: {
		type: String,
		required: false
	}
});

var credential = module.exports = mongoose.model('credential', credentialSchema);

module.exports.createCredentials = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getCredentialsByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getCredentialsById = function(id, callback){
	User.findById(id, callback);
}
