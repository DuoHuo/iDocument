/*
 * User object
 * {
 *   _id: ObjectId(),
 *   username: 'admin',
 *   email: 'admin@example.com',
 *   password: sha256('mypassword')
 * }
 * */

 var Schema = require('mongoose').Schema;

 module.exports = new Schema({
   username: String,
   email: String,
   password: String
 }).pre('save', function (next) {
   if (this.isNew) {
     this.createdAt = Date.now();
   }
   next();
 });
