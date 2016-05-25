
/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var session = require('express-session'); //express的session中间件
var logger = require('morgan');
var cookieParser = require('cookie-parser'); //session需要cookie-parser中间件
var csurf = require('csurf');
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('./config.js');
var app = express();
var port = process.env.PORT || 3000;

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csurf({ cookie: true }))
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'));
app.use('/api/v1', require('./routes/api'));

// handle 404
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
//监听端口
app.listen(port);
console.log('idoc start at: ' + port);
