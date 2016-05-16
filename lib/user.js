const Log = require("debug")("app:lib:user");
const mongoose = require("mongoose");
const config = require('../config');

mongoose.Promise = global.Promise;

const User = mongoose.model(config.db.user.model, {});

module.exports = (req, res, next) => {
	let _id = config.db.user.getID(req.session);
	Log('current', _id);

	User.findOne({
		_id: _id
	}).exec().then(user => {
        let check = config.db.user.pass(user);
		if(check === true) return next();
		res.status(check).end();
	}).catch(e => {
		Log(e.stack || e);
		res.status(500).end();
	});
};
