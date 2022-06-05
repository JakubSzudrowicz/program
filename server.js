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
const { roles } = require('./utils/roles')
const helmet = require('helmet')



app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const MongoStore = connectMongo(session)

// app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'originalCookieNameNotOneFromYoutube',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true,
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000,
  },
  store: new MongoStore({
     mongooseConnection:mongoose.connection 
    })
  })
)


app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport.auth')

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.use(connectFlash())
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

app.use(helmet({
  contentSecurityPolicy: {
      directives: {
          styleSrc: ["'self'",'https://fonts.googleapis.com'],
          scriptSrc: ['*', "'unsafe-inline'", 'https://ajax.googleapis.com'],
      },
      noCache: true,
  }
}))



//Index route
app.use('/', 
require('./routes/index.route'))

//auth route
app.use('/auth', 
require('./routes/auth.route'))

//user route
app.use('/user',
  connectEnsureLogin.ensureLoggedIn({
    redirectTo:'/auth/login'}), 
  require('./routes/user.route'))

//user route
app.use('/user/devices',
connectEnsureLogin.ensureLoggedIn({
  redirectTo:'/auth/login'}), 
require('./routes/user.route'))

//admin route
app.use('/admin',
  connectEnsureLogin.ensureLoggedIn({
    redirectTo:'/auth/login'}),
    ensureAdmin,   
  require('./routes/admin.route'))

  //admin route to devices
// app.use('/admin/devices',
// connectEnsureLogin.ensureLoggedIn({
//   redirectTo:'/auth/login'}),
//   ensureAdmin,   
// require('./routes/admin.devices.route'))

app.use('/admin/modbus',
connectEnsureLogin.ensureLoggedIn({
  redirectTo:'/auth/login'}),
  ensureAdmin,   
require('./routes/modbus.route'))


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
    app.listen(PORT, () => console.log(`Server up running on port ${PORT}...`))
  }).catch(err => console.log(err.message))


function ensureAdmin(req, res, next) {
  if(req.user.role === roles.admin) {
    next()
  } else {
    req.flash('warning', 'Permission denied')
    res.redirect('/')
  }
}