const Recipe = require('../../models/Recipe')
const File = require('../../models/File')

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
    
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        if (req.files.length == 0) {
            return res.send('Por favor, envie ao menos uma imagem!')
        }

        
        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id
        
        const filesPromise = req.files.map(file => File.create({ ...file }))
        results = await Promise.all(filesPromise)
        
        const recipeFilesPromise = results.map(file => File.createRecipeFile(recipeId, file.rows[0].id))
        await Promise.all(recipeFilesPromise)

        return res.redirect(`/admin/recipes/${recipeId}/edit`)
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