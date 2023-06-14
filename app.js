const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

const systemConfig = require('./mapp/configs/system');
const connection = require('./mapp/configs/database');

const moment = require('moment');

global._basedir = __dirname;

console.log(__dirname);

// config connect to mongodb
(async () => {
  try {
    await connection();
  } catch (error) {
    console.log(`ERR connect to DB: ${error}`);
  }
})();

// config view engine 
app.set('views', path.join(__dirname, 'mapp/views'));
app.set('view engine', 'ejs');

// set use express-layout
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'node0523',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

// local constiable --> variable systemConfig using for files ejs
app.locals.systemConfig = systemConfig;
app.locals.moment = moment;

// Router 
app.use('/', require('./mapp/routes/index'));


//======================================ERROR==============================================//
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // if (req.path.startsWith("/admin")) {
  //   res.status(err.status || 500);
  //   res.render('error');
  // } else {
  //   res.status(err.status || 500);
  //   res.render('error');
  // }

  // remove set layout 
  //console.log(`-> remove set layout`);
  req.app.set('layout', false); // hoặc req.app.set('layout', undefined);

  // render the error page
  res.status(err.status || 500);
  console.log(err.status);
  console.log(err.stack);

  console.log(`-> get page error`);
  res.render('error');
});

module.exports = app;
