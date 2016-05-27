var Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

/*
 * Course object
 * {
 *   _id: ObjectId(),
 *   courseName: 'Computer Science',
 *   courseType: 'general/professional',
 *   courseBelongs: 'college _id',
 *   coursepic: '/path/to/pic'
 *   courseDownloads: 100
 * }
 * */

module.exports = new Schema({
  courseName: String,
  courseType: String,
  coursepic: String,
  courseBelongs: {
    type: ObjectId,
    ref: 'college'
  },
  courseDownloads: Number
}).pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
