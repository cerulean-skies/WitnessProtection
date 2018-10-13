var express = require('express');
var router = express.Router();
const adduser = require('../models/adduser');
// const users = require('../routes/users');
const User = require('../models/user');

// if (res.signing_key === 'WLS1111111111111111111111111111111114T1Anm') process.exit();
// if (backupKey === res.signing_key) wls.broadcast.witnessUpdate(activeKey, witnessName, witnessLink, 'WLS1111111111111111111111111111111114T1Anm', props, "0.000 WLS", function (err, res) {
// 	if (err) {
// 		throw new Error(err);
// 	}
// });


let wls = require("wlsjs");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
// if (process.env.node && process.env.node !== "") {
// 	wls.api.setOptions({ url: process.env.node });
// } else {
// 	wls.api.setOptions({ url: 'wss://beta.whaleshares.net/wss' });
// }


// wls.api.setOptions({ url: 'wss://beta.whaleshares.net/wss' });
wls.api.setOptions({ url: 'ws://188.166.99.136:8090' });
wls.config.set('address_prefix', 'WLS');
wls.config.set('chain_id', 'de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866');


router.post('/run', ensureAuthenticated, function(req, res){
	return res.redirect('/test/running')
});
// Get Homepage
router.get('/running', ensureAuthenticated, function(req, res){
	console.log("Witness Protection Engaged ---- @" + res.locals.user.username);

	// console.log(res.locals.user);
	// console.log(app.locals.user);


	// The name of the witness we're watching.
	const witness_name = res.locals.user.username;
	const receiver = res.locals.user.email;
	// The active key of the witness' account.
	const active_key = res.locals.user.ActivePassword;
	// The public key for the backup server.
	const backup_key = res.locals.user.backupPassword;
	// The public key for the backup server.
	const mainBrain_key = res.locals.user.mainBrainKey;
	// The witness information url.
	const witness_link = res.locals.user.WitnessLink;
	// The consensus variable for account creation fees.
	const account_creation_fee = res.locals.user.accountCreationFee;
	// The consensus variable for the maximum block size.
	const maximum_block_size = parseInt(res.locals.user.MaximumBlockSize);
	// The threshold, or the amount of missed blocks to then switch witness nodes.
	// let threshold = parseInt(res.locals.user.threshold);
	// The seconds between checks for missed blocks.
	const check_rate = parseInt(res.locals.user.checkRate);
	// Email to send notifications to.
	const email = res.locals.user.sendMailLogin;
	// Password to your email for nodemailer.
	const password = res.locals.user.sendMailPassword;
	const props = {
		account_creation_fee,
		maximum_block_size
	};

	const switches = "";


	adduser.find({ownerUsername: res.locals.user.username}).then(function(results){
		res.render('index', {favourites: results});
		// checkWitness(witness_name, active_key, backup_key, mainBrain_key, witness_link, account_creation_fee, maximum_block_size, threshold, check_rate, email, password, props, receiver, switches);
		setInterval(function() {
			let threshold = parseInt(res.locals.user.threshold);
			// console.log("Running QueryFunction Now");
			let thresh;
			User.findOne({username: witness_name}, function(err,obj) {
				// console.log("obj.threshold is = "+obj.threshold);
				thresh = obj.threshold;
				// console.log("Thresh is = " + thresh);
				checkWitness(witness_name, active_key, backup_key, mainBrain_key, witness_link, account_creation_fee, maximum_block_size, thresh, check_rate, email, password, props, receiver, switches);

			 });

			// console.log("FInished Running QueryFunction Now");


		}, 10 * 1000);
		// console.log("restarting function \n Threshold value is " +res.locals.user.threshold);
	})

});

// function getJedisQuery(){
//    var query = User.find({username:witnessName});
//    return query;
// 	 console.log(query);
// }


function checkWitness(witnessName, activeKey, backupKey, mainBrainKey, witnessLink, CreationFee, MaxBlockSize, Threshold, checkRate, email, password, props, receiver, switches) {
	// console.log("Running CheckWitness() Now");
	// console.log("Threshold in Start of Check Function is = " +Threshold);


// process.stdout.write("\u001b[2J\u001b[0;0H");
wls.api.getWitnessByAccount(witnessName, function (err, res) {

if (err) {
	throw new Error(err);
} else {
	// console.log(res.signing_key);
	// if (res.signing_key === mainBrainKey){
	// 	console.log("Running on Main Server");
	// }
	// if (res.signing_key === backupKey){
	// 	console.log("Running on Backup Server");
	// }
	process.stdout.write('Total Missed = ' + res.total_missed);
	setTimeout(function() {

		process.stdout.write("	Checked @" + new Date());
		// process.stdout.cursorTo(12);
		process.stdout.cursorTo(0);

}, 5000);
// 	setTimeout(function() {
// 		process.stdout.clearLine();
//
// }, 9800);
	if (res.total_missed >= Threshold) {
		// console.log(res.total_missed);
		// console.log("res.total_missed is = " +res.total_missed);

		// console.log("updating Witness");

		Threshold++
		User.update({username: witnessName}, {
		    threshold: Threshold,

		}, function(err, numberAffected, rawResponse) {
		   //handle it
		})
		updateWitness(witnessName, activeKey, backupKey, mainBrainKey, witnessLink, password, email, props, Threshold, receiver, switches);


		console.log("\nThreshold set to: "+Threshold);
		// console.log("Threshold in Check Function is = " +Threshold);

	}
}
})
}



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}




function updateWitness(witnessName, activeKey, backupKey, mainBrainKey, witnessLink, password, email, props, Threshold, receiver, switches) {
process.stdout.clearLine();
// console.log("Running updateWitness() Now");


process.stdout.write("\n"); // end the line

console.log("Missed Block, Changing Servers");

nodemailer.createTestAccount((err, account) => {
let transporter = nodemailer.createTransport(smtpTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	auth: {
		user: email,
		pass: password
	}
}));
let mailOptions = {
	from: `"${email}"`,
	to: `"${email}"`,
	subject: 'You missed a block, switching servers',
	text: `You missed a block at ${new Date(Date.now()).toString()}`
};
transporter.sendMail(mailOptions, (error, info) => {
	if (error) {
		throw new Error(error);
	}
});
});
// console.log("Threshold in Update Function is = "+Threshold);
wls.api.getWitnessByAccount(witnessName, function (err, res) {
	// console.log(res);
if (err) throw new Error(err);




if (res.signing_key === 'WLS1111111111111111111111111111111114T1Anm'){process.exit();}
if (backupKey === res.signing_key){
wls.broadcast.witnessUpdate(activeKey, witnessName, witnessLink, mainBrainKey, props, "0.000 WLS", function (err, res) {
	if (err) {
		throw new Error(err);
	}
});
switches += 1;
console.log("switches set to " + switches);

console.log("Working on Server backup");
// switches = "backup"
console.log("Switching to main");
console.log("\n");

}


else if (mainBrainKey === res.signing_key){
wls.broadcast.witnessUpdate(activeKey, witnessName, witnessLink, backupKey, props, "0.000 WLS", function (err, res) {
	if (err) {
		throw new Error(err);
	}

});

switches += 1;
console.log("switches set to " + switches);
console.log("Working on Server Main");
// switches = "main"
// console.log(switches);
console.log("Switching to Backup");
console.log("\n");

}
});
}

module.exports = router;
