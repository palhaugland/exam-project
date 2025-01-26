var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var setupSwagger = require('./swagger');

// Import the database (with models and sequelize instance)
var db = require('./models');

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var initRouter = require('./routes/init');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var cartRouter = require('./routes/cart');
var ordersRouter = require('./routes/orders');

// Create the Express app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
setupSwagger(app);

// Route setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/init', initRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

// Sync database
db.sequelize
    .sync({ force: false }) // Set `force: true` only for development to recreate the tables
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch((error) => {
        console.error('Unable to sync database:', error);
    });

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;