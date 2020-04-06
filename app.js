var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

var env = require('node-env-file');
var env_file = process.env.NODE_ENV || 'development';
env(__dirname + '/.env.'+env_file); //Load from file

var morgan = require('morgan'); // HTTP request logger
morgan('dev');

var app = express();

//DB intialization
var db = require('./v1/db');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/', indexRouter);

app.use('/api/', apiRouter);

//API ROUTES start
var userRoutes = require('./v1/routes/userRoutes');
userRoutes(app);
//END


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
    res.send('Error : No Route Found');
});

module.exports = app;