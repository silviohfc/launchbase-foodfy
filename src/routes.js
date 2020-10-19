const express = require('express')
const routes = express.Router()

const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const data = require('../data.json')

routes.get("/", (req, res) => {
    return res.render("index")
})
routes.get("/about", (req, res) => {
    return res.render("about")
})
routes.get("/recipes", (req, res) => {
    return res.render("recipes/index", { recipes: data.recipes })
})
routes.get("/recipes/:index", (req, res) => {
    const recipeIndex = req.params.index
    if (!recipes[recipeIndex-1]) {
        return res.send("A receita não existe!")
    }else {
        return res.render("recipes/recipe_info", { recipe: data.recipes[recipeIndex-1] })
    }
})

/* -------------------------------------------------------------------------- */
/*                                ADMIN RECIPES                               */
/* -------------------------------------------------------------------------- */

routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", recipes.edit)

routes.post("/admin/recipes", recipes.post)
routes.put("/admin/recipes", recipes.put)
routes.delete("/admin/recipes", recipes.delete)

/* -------------------------------------------------------------------------- */
/*                                 ADMIN CHEFS                                */
/* -------------------------------------------------------------------------- */

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)

routes.post("/admin/chefs", chefs.post)
routes.put("/admin/chefs", chefs.put)
routes.delete("/admin/chefs", chefs.delete)

module.exports = routes