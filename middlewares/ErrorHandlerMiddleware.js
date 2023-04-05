function errorHandlingMiddleware(err, req, res, next) {
  try {
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error!' })
  }
}

module.exports = errorHandlingMiddleware