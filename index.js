const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const errorHandlingMiddleware = require('./middlewares/ErrorHandlerMiddleware')
const authRouter = require('./routes/authRoutes')
const postsRouter = require('./routes/postRoutes')
const profileRouter = require('./routes/profileRoutes')
const notificationRouter = require('./routes/notificationRoutes')
const authMiddleware = require('./middlewares/authorizationMiddleware')
const app = express()


app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(express.json({limit: "10MB"}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/client'))

app.use(express.json())
app.use(cookieParser())
app.use(express.static('client'))

app.use(errorHandlingMiddleware)

app.get('/', (req, res) => {
  res.render('./Pages/home')
})
app.use('/auth', authRouter)
app.use('/profile', authMiddleware.verifyLogin, profileRouter)
app.use('/notification', authMiddleware.verifyLogin, notificationRouter)
app.use('/post', authMiddleware.verifyLogin, postsRouter)

app.use('/admin', (req, res, next)=>{
  return res.render('./Pages/admin')
})


app.all('*', (req, res) => {
  res.render('./Pages/notFoundError')
})

mongoose
  .connect(
    'mongodb+srv://BeYou:0UDFawl93H6U0OBy@cluster0.uswxmtk.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() =>
    app.listen(5000, () => {
      console.log('App Listening on 5000')
    }),
  )
  .catch((error) => {
    console.log(error)
  })
