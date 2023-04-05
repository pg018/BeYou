const getPosts = (req, res) => {
  return res.render('./Pages/dashboard', { main: './posts.ejs', title: 'Feed' })
}

const postsController = {
  getPosts,
}

module.exports = postsController
