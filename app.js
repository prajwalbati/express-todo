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
const cors = require('cors');

require('dotenv').config();

let app = express();
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');
let { isLoggedIn } = require("./middleware/authenticateMiddleware");

app.use(session({
  secret: 'zSDasdSDASDASD91287assdSzassasda',
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
app.use('/users', usersRouter);

app.use('/api-docs', (req, res) => {
  return res.send('API docs');
});

app.use('/api', cors(), apiRouter);

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