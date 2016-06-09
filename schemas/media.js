var Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
  key: {
    type: String,
    required: true
  },
  qiniu_url: String,
  local_url: String,
  hash: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
}).pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
