const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejslayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require('./routes/index-route');
const usersRouter = require('./routes/user-route');
const authRouter = require('./routes/auth-route');
const chatRouter = require('./routes/chat-route');

/**require passport */
require('./utils/passport')(passport);

const app = express();

// view engine and ejs layout setup 
app.use(ejslayouts);
app.set('layout',path.join(__dirname, 'views', 'layouts', 'app-layout.ejs'));
app.set("layout extractScripts", true)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fontawesome',express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free')));


/**
 * session
 */
 app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

/**
 * intializing passport
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * flash
 */
app.use(flash());



/** routes  */
app.use((req, res, next) => {
  res.locals.authenticated = req.isAuthenticated() ? true : false;
  res.locals.appName = process.env.APP_NAME;
  res.locals.successMsg = req.flash('success');
  res.locals.errorMsg = req.flash('fail');
  res.locals.infoMsg = req.flash('info');
  res.locals.warningMsg = req.flash('warning');
  res.locals.error = req.flash('error');
  res.locals.title = process.env.APP_NAME;
  next();
});
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/users', chatRouter);

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
