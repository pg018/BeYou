const dashboardConfig = require('../helpers/dashboardConfig')

const getNotifications = async (req, res) => {
  const jwtCookie = req.cookies.jwt
  const config = await dashboardConfig(
    jwtCookie,
    './notification.ejs',
    'Notifications',
  )
  return res.render('./Pages/dashboard', {...config})
}

const notificationsController = {
  getNotifications,
}

module.exports = notificationsController
