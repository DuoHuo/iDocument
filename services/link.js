var Link = require('../model').Link;

exports.fetch = function() {
	return Link.find();
};

exports.get = function(id) {
	return Link.findById(id);
};

exports.add = function(newLink) {
	return new Link(newLink).save();
};

exports.remove = function(id) {
	return Link.findByIdAndRemove(id);
};
