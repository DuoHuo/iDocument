var mongoose = require('mongoose');
var config = require('./config');
mongoose.Promise = require('promise');

var connection = mongoose.createConnection(config.mongodb);
var User = connection.model('user', require('./schemas/user'));
var College = connection.model('college', require('./schemas/college'));
var Course = connection.model('course', require('./schemas/course'));
var Document = connection.model('document', require('./schemas/document'));
var Banner = connection.model('banner', require('./schemas/banner'));
var Link = connection.model('link', require('./schemas/link'));
var Media = connection.model('media', require('./schemas/media'));

//noinspection JSAnnotator
module.exports = {
  User,
  College,
  Course,
  Document,
  Banner,
  Link,
  Media
};
