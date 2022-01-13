var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({
  secret: 'zSDasdSDASDASD91287assdSzassasda',
  saveUninitialized: true,
  resave: true
}));
// app.use(passport.initialize());
//     app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(methodOverride('_method'));

require("./database/mongoose");

app.use(async(req, res, next) => {
    res.locals['success_msg'] = req.flash('success_msg');
    res.locals['error_msg'] = req.flash('error_msg');
    res.locals['errors'] = req.flash('errors');
    // res.locals['inputData'] = req.flash('inputData')[0];
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
