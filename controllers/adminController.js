const userModel = require('../schemas/userSchema')
const JWTService = require('../services/JWTService')
const reportModel = require('../schemas/reporterSchema')
const getAdmin = async (req, res) => {
  const thistotalaccounts = new Promise((resolve) => resolve(userModel.count()))
  const thistotalBlockedUsers = new Promise((resolve) =>
    resolve(userModel.count({ blocked: true })),
  )
  const thistotalVerifiedUsers = new Promise((resolve) =>
    resolve(userModel.count({ verified: true })),
  )
  let reportsArray;
  const thisreports = new Promise((resolve) =>
    resolve(reportModel.find()))
  
  const [totalaccounts, totalblocked, totalverified, reports] =
    await Promise.all([
      thistotalaccounts,
      thistotalBlockedUsers,
      thistotalVerifiedUsers,
      thisreports,
    ])

  return res.render('./Pages/admin', {
    totalaccounts: totalaccounts,
    totalblocked: totalblocked,
    totalverified: totalverified,
    reports: reports,
  })
}

const getReport = async (req, res) => {
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

const adminControllers = {
  getAdmin,
  getReport,
}

module.exports = adminControllers
