const data = require('../data')

exports.index = (req, res) => {
    return res.render("admin/index", { recipes: data })
}

exports.create = (req, res) => {
    return res.render("admin/create")
}

exports.post = (req, res) => {
    return res.send(req.body)
}

exports.show = (req, res) => {
    return res.render("admin/recipe_info", { recipe: data[0] })
}