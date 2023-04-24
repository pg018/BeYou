const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
})

const reportModel = mongoose.model('Report', reportSchema, 'ReportCollection')

module.exports = reportModel
