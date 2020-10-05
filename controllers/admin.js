const data = require('../data')

exports.index = (req, res) => {
    return res.render("admin/index", { recipes: data })
}