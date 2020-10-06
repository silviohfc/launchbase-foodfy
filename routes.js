const express = require('express')
const routes = express.Router()
const admin = require('./controllers/admin')

const recipes = require('./data')

routes.get("/", (req, res) => {
    return res.render("index")
})
routes.get("/about", (req, res) => {
    return res.render("about")
})
routes.get("/recipes", (req, res) => {
    return res.render("recipes/index", { recipes })
})
routes.get("/recipes/:index", (req, res) => {
    const recipeIndex = req.params.index
    if (!recipes[recipeIndex-1]) {
        return res.send("A receita não existe!")
    }else {
        return res.render("recipes/recipe_info", { recipe: recipes[recipeIndex-1] })
    }
})

routes.get("/admin/recipes", admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.get("/admin/recipes/:id", admin.show)
routes.get("/admin/recipes/:id/edit", admin.edit)

routes.post("/admin/recipes", admin.post)
routes.put("/admin/recipes", admin.put)
routes.delete("/admin/recipes", admin.delete)

module.exports = routes