var College = require('../model').College;

exports.fetch = function() {
	return College.find();
};

exports.get = function(id) {
	return College.findById(id);
};

exports.add = function(newcollege) {
	return new College(newcollege).save();
};

exports.remove = function(id) {
	return College.findByIdAndRemove(id);
};
