var Media = require('../model').Media;

exports.getAll = function(type) {
  return Media.find({type: type}).sort({ createdAt: -1 });
}

exports.get = function(id) {
  return Media.findById(id);
};

exports.search = function(q) {
	return Media.find({ key: {$regex: q } }).sort({ createdAt: -1 });
};

exports.create = function(media) {
  return new Media(Object.assign({}, media)).save();
};

exports.delete = function (id) {
  return Media.findByIdAndRemove(id);
};
