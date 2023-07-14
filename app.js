const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const session=require('express-session')
const bodyParser=require('body-parser')
const cors=require('cors')
const flash=require('connect-flash')
require('dotenv').config()
try {
  
  mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  console.log('Berhasil connect')
} catch (error) {
  console.log(error)
}

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/userRoutes');
const adminRouter=require('./routes/admin/adminRoutes')
const apiRouter=require('./routes/api/apiRoutes')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride("_method"));
app.use(session({
  secret: 'its my secret',
  cookie: { maxAge: 12000000 }, // value of maxAge is defined in milliseconds. 
  resave: false,
  rolling: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2',express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/admin',adminRouter)
app.use('/api-v1',apiRouter)
app.use('/api-v1',usersRouter)


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
