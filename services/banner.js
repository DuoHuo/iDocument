var Banner = require('../model').Banner;

exports.fetch = function(limit, offset) {
	return Banner.find({}).limit(limit).skip(offset);
};

exports.get = function(id) {
	return Banner.findById(id);
};

exports.add = function(newBanner) {
	return new Banner(newBanner).save();
};

exports.remove = function(id) {
	return Banner.findByIdAndRemove(id);
};
