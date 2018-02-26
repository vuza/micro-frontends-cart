const data = {}

module.exports = {
  handleProductPost: (req, res) => {
    const user = req.body.user

    console.log(req.body)

    if (!data[user]) {
      data[user] = []
    }

    data[user].push(req.body.product)

    res.end()
  },

  getProducts: username => data[username] ? data[username] : []
}
