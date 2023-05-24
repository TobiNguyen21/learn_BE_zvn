const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const flash = require('connect-flash');

const app = express();

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const systemConfig = require('./configs/system');
const connection = require('./configs/database');




// mongoose.connect('mongodb+srv://tobinguyen399:TobiNguyen399@cluster0.tgoqjlv.mongodb.net/?retryWrites=true&w=majority');
// //connection mongodb
// const db = mongoose.connection;
// db.on('error', () => {
//   console.log('connection error');
// });
// db.once('open', () => {
//   console.log('connected');
// });

(async () => {
  try {
    //using mogoose
    await connection();

  } catch (error) {
    console.log(">> Error connect to db", error);
  }
})()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'backend.ejs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());



//local constiable
app.locals.systemConfig = systemConfig;

//Setup router
app.use(`/${systemConfig.prefixAdmin}`, require('./routes/backend'));
app.use('/', require('./routes/frontend'));

//==========================================================================================//
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error', { pageTitle: 'Error Page' });
})

module.exports = app;
