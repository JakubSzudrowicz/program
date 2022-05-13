require('dotenv').config()
const express = require('express')
const app = express()
const createHttpError = require('http-errors')
const mongoose  = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const connectFlash = require('connect-flash')
const passport = require('passport')
const connectMongo = require('connect-mongo')
const connectEnsureLogin = require('connect-ensure-login')

app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const MongoStore = connectMongo(session)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    // secure: true,
    httpOnly: true,
    expires: 30 * 1000,
  },
  store: new MongoStore({ mongooseConnection:mongoose.connection })
  })
)

app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport.auth')

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// app.use((req,res,next) => {
//   start = Date.now()
//   milis = start - date
//   res.locals.maxAge =  req.session.cookie.maxAge + Date.now()
//   console.log('zostaniesz wylogowany za' + res.locals.maxAge/1000)
//   next()
// })

app.use(connectFlash())
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

//Index route
app.use('/', require('./routes/index.route'))

//auth route
app.use('/auth', require('./routes/auth.route'))

//user route
app.use('/user',
  connectEnsureLogin.ensureLoggedIn({
  redirectTo:'/auth/login'}), 
  require('./routes/user.route'))


//404 Handler
app.use((req, res, next) => {
    next(createHttpError.NotFound())
});
  
//Error Handler
app.use((error, req, res, next) => {
    error.status = error.status || 500
    res.status(error.status)
    res.render('error_40x', {error})
})


const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=> console.log(`Server up running on port ${PORT}...`))
  }).catch(err => console.log(err.message))

