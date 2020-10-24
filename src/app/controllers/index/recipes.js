const Recipe = require("../../models/Recipe")

module.exports = {
    index(req, res) {
        let { search, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)

        const params = {
            search,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("recipes/index", { recipes, pagination, search })
            }
        }

        Recipe.paginate(params)

    },

    show(req, res) {
        const { id } = req.params

        Recipe.find(id, recipe => {
            if (!recipe) return res.send("A receita não existe!")

            return res.render("recipes/recipe_info", { recipe })
        })
    }
}