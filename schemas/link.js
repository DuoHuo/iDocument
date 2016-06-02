var Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

/*
 * Link object
 * {
 *   _id: ObjectId(),
 *   title: '链接名称'
 *   category: 'duohuo/friendship/about',
 *   link: '链接地址'
 * }
 * */

module.exports = new Schema({
  title: String,
  category: String,
  link: String
}).pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
