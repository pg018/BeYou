const dashboardConfig = require("../helpers/dashboardConfig");


const getChats = async (req, res) => {
    const jwtCookie = req.cookies.jwt
    const config = await dashboardConfig(
        jwtCookie,
        './chat.ejs',
        'Chat',
    )
    return res.render("./Pages/dashboard", {...config});
}

const chatController = {
    getChats
}

module.exports = chatController