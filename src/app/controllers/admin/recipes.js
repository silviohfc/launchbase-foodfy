const Recipe = require('../../models/Recipe')

module.exports = {
    redirect(req, res) {
        res.redirect("/admin/recipes")
    },

    index(req, res) {
        Recipe.all(recipes => {
            return res.render("admin/recipes/index", { recipes })
        })
    },
    
    create(req, res) {
        Recipe.chefSelectOptions(chefs => {
            return res.render("admin/recipes/create", { chefs })
        })        
    },
    
    post(req, res) {
        Recipe.create(req.body, recipe => {
            return res.redirect(`/admin/recipes/${ recipe.id }`)
        })
    },
    
    show(req, res) {
        const recipeId = req.params.id

        Recipe.find(recipeId, recipe => {
            if (!recipe) return res.send("A receita não existe")

            return res.render("admin/recipes/recipe_info", { recipe })
        })

    },
    
    edit(req, res) {
        const recipeId = req.params.id
        
        Recipe.find(recipeId, recipe => {
            if (!recipe) return res.send("A receita não existe")

            Recipe.chefSelectOptions(chefs => {
                return res.render("admin/recipes/edit", { recipe, chefs })
            })
        })
    },
    
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }
    
        Recipe.update(req.body, () => {
            return res.redirect(`recipes/${req.body.id}`)
        })
    },
    
    delete(req, res) {
        const { id } = req.body
    
        Recipe.delete(id, () => {
            return res.redirect("/admin/recipes")
        })
    }
}