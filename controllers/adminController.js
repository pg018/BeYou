const userModel = require('../schemas/userSchema')
const JWTService = require('../services/JWTService')
const reportModel = require('../schemas/reporterSchema')
const postModel = require('../schemas/postSchema')
const friendsModel = require('../schemas/friendsSchema')
const reporterModel = require('../schemas/reporterSchema')
const notificationModel = require('../schemas/notificationSchema')
const mongoose = require('mongoose')

const getAdmin = async (req, res) => {
  const thistotalaccounts = new Promise((resolve) => resolve(userModel.find()))
  const thistotalVerifiedUsers = new Promise((resolve) =>
    resolve(userModel.find({ verified: true })),
  )
  let reportsArray
  const thisreports = new Promise((resolve) => resolve(reportModel.find()))

  const [accounts, totalverified, reports] = await Promise.all([
    thistotalaccounts,
    thistotalVerifiedUsers,
    thisreports,
  ])

  return res.render('./Pages/admin', {
    accounts: accounts,
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
  let rep
  reportModel
    .find({ _id: reportId })
    .then((report) => {
      rep = report
      return report
    })
    .then((report) => {
      userModel.findOne({ stringId: report[0].toUserId }).then((user) => {
        res.render('./Pages/report', {
          report: report[0],
          reporteduser: user,
        })
      }) 
    })
    .catch((err) => {
      console.log(err)
      res.redirect('/admin')
    })
}

const deleteAccount = async (req, res) => {
  const userId = req.params.deleteId
  await postModel.deleteMany({ userId })
  await friendsModel.deleteMany({
    $or: [{ userId }, { followingUserId: userId }],
  })
  await notificationModel.deleteMany({
    $or: [{ fromId: userId }, { toId: userId }],
  })
  await reporterModel.deleteMany({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  })
  await userModel.findByIdAndDelete(userId)
  return res.redirect('/admin')
}


const deleteReport = async (req, res) => {
  const reportId = req.params.reportId;
  reportModel.findOneAndRemove({_id:reportId}).then(()=>{
    res.redirect('/admin')
  }).catch(err=>{
    console.log(err)
  })
}

const adminControllers = {
  getAdmin,
  getReport,
  getReportUser,
  deleteAccount,
  deleteReport
}

module.exports = adminControllers
