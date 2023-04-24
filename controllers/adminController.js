const userModel = require('../schemas/userSchema')
const JWTService = require('../services/JWTService')
const reportModel = require('../schemas/reporterSchema')
const getAdmin = async (req, res) => {
  const thistotalaccounts = new Promise((resolve) => resolve(userModel.find()))
  const thistotalBlockedUsers = new Promise((resolve) =>
    resolve(userModel.find({ blocked: true })),
  )
  const thistotalVerifiedUsers = new Promise((resolve) =>
    resolve(userModel.find({ verified: true })),
  )
  let reportsArray
  const thisreports = new Promise((resolve) => resolve(reportModel.find()))

  const [accounts, totalblocked, totalverified, reports] = await Promise.all([
    thistotalaccounts,
    thistotalBlockedUsers,
    thistotalVerifiedUsers,
    thisreports,
  ])

  return res.render('./Pages/admin', {
    accounts: accounts,
    totalblocked: totalblocked,
    totalverified: totalverified,
    reports: reports,
  })
}

const getReportUser = async (req, res) => {
  const reportedId = req.params.reportedId
  const jwtCookie = req.cookies.jwt
  const userId = JWTService.GetDecodedToken(jwtCookie).userId
  const report = new reportModel({
    fromUserId: userId,
    toUserId: reportedId,
  })
  await report.save()
  res.redirect('/post/posts')
}

const getReport = async (req, res) => {
  const reportId = req.params.reportId
  reportModel
    .find({ _id: reportId })
    .then((report) => {
      res.render('./Pages/report',{
        report: report[0]
      })
    })
    .catch((err) => {
      console.log(err)
      res.redirect('/admin')
    })
}

const adminControllers = {
  getAdmin,
  getReport,
  getReportUser
}

module.exports = adminControllers
