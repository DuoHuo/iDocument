var Media = require('../model').Media;

exports.getAll = function() {
  return Media.find().exec();
}

exports.get = function(id) {
  return Media.findById(id);
};

exports.create = function(media) {
  return new Media(Object.assign({}, media)).save();
};

exports.delete = function (id) {
  return Media.findByIdAndRemove(id);
};
