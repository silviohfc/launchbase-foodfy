const express = require('express')
const routes = express.Router()

const admin_recipes = require('./app/controllers/admin/recipes')
const admin_chefs = require('./app/controllers/admin/chefs')
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

routes.get("/admin", admin_recipes.redirect)
routes.get("/admin/recipes", admin_recipes.index)
routes.get("/admin/recipes/create", admin_recipes.create)
routes.get("/admin/recipes/:id", admin_recipes.show)
routes.get("/admin/recipes/:id/edit", admin_recipes.edit)

routes.post("/admin/recipes", admin_recipes.post)
routes.put("/admin/recipes", admin_recipes.put)
routes.delete("/admin/recipes", admin_recipes.delete)

/* -------------------------------------------------------------------------- */
/*                                 ADMIN CHEFS                                */
/* -------------------------------------------------------------------------- */

routes.get("/admin/chefs", admin_chefs.index)
routes.get("/admin/chefs/create", admin_chefs.create)
routes.get("/admin/chefs/:id", admin_chefs.show)
routes.get("/admin/chefs/:id/edit", admin_chefs.edit)

routes.post("/admin/chefs", admin_chefs.post)
routes.put("/admin/chefs", admin_chefs.put)
routes.delete("/admin/chefs", admin_chefs.delete)

module.exports = routes