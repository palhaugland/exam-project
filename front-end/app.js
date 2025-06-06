require('dotenv').config();               
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var dashboardRouter = require('./routes/dashboard');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var brandsRouter = require('./routes/brands');
var ordersRouter = require('./routes/orders');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret token',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.successMessage = req.session.successMessage;
  res.locals.errorMessage = req.session.errorMessage;
  delete req.session.successMessage;
  delete req.session.errorMessage;
  next();
});

// Ensure Admin is available in all views
app.use((req, res, next) => {
  console.log("Session Role at Middleware:", req.session?.role); 
  res.locals.isAdmin = req.session?.role === 'admin';
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/', dashboardRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/' , (req, res) => {
  res.redirect('/auth/login');
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
