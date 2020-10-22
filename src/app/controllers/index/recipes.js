const Chef = require("../../models/Chef")
const Recipe = require("../../models/Recipe")

module.exports = {
    index(req, res) {
        const { search } = req.query

        if (search && search !== "") {
            Recipe.findByName(search, recipes => {
                if (recipes.length < 1) {
                    return res.render("recipes/index", { search })
                }
                return res.render("recipes/index", { recipes, search })
            })
        } else {
            Recipe.all(recipes => {
                return res.render("recipes/index", { recipes })
            })
        }

        
    }
}