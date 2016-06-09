
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
var port = config.bindPort || 3000;
var linkController = require('./controllers/link');

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

//连接mongoDb数据库
var MongoStore = require('connect-mongo')(session);

//把session存到mongodb数据库中去
app.use(session({
  secret: config.cookieSecret,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  store: new MongoStore({
    url: config.mongodb,
    collection: 'sessions',
    auto_reconnect: true
  })
}));

//routes
app.use('/api/v1', require('./routes/api'));
app.use('/fix', require('./routes/fix'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csurf({ cookie: true }))

//render page
app.use(function(req, res, next){
  linkController.fetchLinks()
  .then(function(links){
    res.locals.duohuoLinks = links.filter(function(link){ return link.category === 'duohuo'});
    res.locals.friendshipLinks = links.filter(function(link){ return link.category === 'friendship'});
    res.locals.aboutLinks = links.filter(function(link){ return link.category === 'about'});
    next();
  })
});

app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));

// handle 404
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

//error handle
app.use(function(err, req, res, next){
	res.send(err.status || 500, err.message);
})
//监听端口
app.listen(port);
console.log('idoc start at: ' + port);
