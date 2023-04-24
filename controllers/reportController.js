const userModel = require('../schemas/userSchema')
const JWTService = require('../services/JWTService')
const reportModel = require('../schemas/reporterSchema')

const getReport = async (req, res) => {
  const reportedId = req.params.reportedId
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  res.render('./Pages/reportuser', {
    reportedId: reportedId,
    subject: '',
    description: '',
  })
}

const postReport = async (req, res) => {
  const reportedId = req.params.reportedId
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  let sub = req.body.subject
  let des = req.body.description

  const report = new reportModel({
    fromUserId: userId,
    toUserId: reportedId,
    subject: sub,
    description: des,
  })
  await report.save()
  res.redirect('/post/posts')
}

const reportController = {
  getReport,
  postReport,
}

module.exports = reportController
