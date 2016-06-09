var Schema = require('mongoose').Schema;

/*
 * College object
 * {
 *   _id: ObjectId(),
 *   collegeName: 'Computer Science',
 *   collegepic: '/path/to/pic',
 *   localPath: '/path/to/pic'
 * }
 * */

module.exports = new Schema({
  collegeName: String,
  localPath: String,
  collegepic: String
}).pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
