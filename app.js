const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');

require('dotenv').config();

let app = express();

let indexRouter = require('./routes/index');

app.use(session({
  secret: 'somesecrettoken',
  saveUninitialized: true,
  resave: true,
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION
  })
}));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

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
    res.locals['inputData'] = req.flash('inputData')[0];

    if(req.user) {
      res.locals['loggedInUser'] = req.user;
    }
    next();
});

app.use('/', indexRouter);

// api routes
require('./routes/api')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const status = err.status ? err.status : 500;
  return res.status(status).json({ error: err.message });
});

module.exports = app;