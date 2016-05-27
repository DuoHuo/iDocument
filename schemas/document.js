var Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;
/*
* Document object
* {
*   _id: ObjectId(),
*   title: doc.title,
*   updateTime: timestamp,
*   belongs: 'college _id',
*   course: 'course _id',
*   type: 'general',
*   downloads: 90,
*   fileType: 'doc',
*   link: 'http://pan.baidu.com/xxxxx',
*   searchIndex: ['高', '等', '数', '学']
* }
* */

module.exports = new Schema({
  title: String,
  updateTime: { type: Date, default: Date.now },
  belongs: {
    type: ObjectId,
    ref: 'college'
  },
  course: {
    type: ObjectId,
    ref: 'course'
  },
  size: String,
  type: String,
  downloads: Number,
  fileType: String,
  link: String,
  searchIndex: Array
}).pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
