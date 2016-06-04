var Link = require('../model').Link;

exports.fetch = function(limit, offset) {
	return Link.find({}).limit(limit).skip(offset);
};

exports.fetchAll = function() {
	return Link.find({});
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
