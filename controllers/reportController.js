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
    description:'',
    error:0
  })
}

const postReport = async (req, res) => {
  const reportedId = req.params.reportedId
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const sub = req.body.subject
  const des = req.body.description
  if (sub.trim().length != 0 && des.trim().lenght != 0) {
    const report = new reportModel({
      fromUserId: userId,
      toUserId: reportedId,
      subject: sub,
      description: des,
    })
    await report.save()
    res.redirect('/post/posts')
  }else{
    res.render('./Pages/reportuser', {
        reportedId: reportedId,
        subject: sub,
        description: des,
        error:1
      })
  }
}

const reportController = {
  getReport,
  postReport,
}

module.exports = reportController
