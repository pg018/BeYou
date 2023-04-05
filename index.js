const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const errorHandlingMiddleware = require('./middlewares/ErrorHandlerMiddleware')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/client'))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('client'))

app.use(errorHandlingMiddleware)

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
