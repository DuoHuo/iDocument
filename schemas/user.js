/*
 * User object
 * {
 *   _id: ObjectId(),
 *   username: 'admin',
 *   email: 'admin@example.com',
 *   password: sha256('mypassword')
 * }
 * */

'use strict';

var Schema = require('mongoose').Schema;
var Mixed = Schema.Types.Mixed;

var bcrypt = require('bcryptjs');

var SALT_WORK_FACTORY = 10;

var UserSchema = new Schema({
 username: String,
 password: String,
 email: String,
 meta: {
   createdAt: {
     type: Date,
     default: Date.now()
   },
   updatedAt: {
     type: Date,
     default: Date.now()
   }
 }
});

UserSchema.pre('save', function (next) {
 var user = this;
 if (this.isNew) {
   this.meta.createdAt = this.meta.updatedAt = Date.now();
 } else {
   this.meta.updatedAt = Date.now();
 }
 //密码加盐
 bcrypt.genSalt(SALT_WORK_FACTORY, function (err, salt) {
   if (err) return next(err);
   bcrypt.hash(user.password, salt, function (err, hash) {
     if (err) return next(err);
     user.password = hash;
     next();
   });
 });
});

//实例方法，从实例里调
UserSchema.methods = {
 comparePassword: function (_password, cb) {
   bcrypt.compare(_password, this.password, function (err, isMatch) {
     if (err) {
       return cb(err);
     }
     cb(null, isMatch);
   });
 }
};

//静态方法，从模型中调
UserSchema.statics = {
 fetch: function () {
   return this.find({}).sort('meta.updatedAt');
 },

 findById: function (id) {
   return this.findOne({ _id: id });
 }
};

module.exports = UserSchema;
