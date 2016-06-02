var Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

/*
 * Banner object
 * {
 *   _id: ObjectId(),
 *   bannerName: 'banner的名称',
 *   bannerIndex: 7,
 *   bannerPic: '/path/to/pic',
 *   bannerLink: '图片链接'
 * }
 * */

module.exports = new Schema({
  bannerName: String,
  bannerIndex: Number,
  bannerPic: String,
  bannerLink: String
}).pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
