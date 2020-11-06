const Recipe = require('../../models/Recipe')
const File = require('../../models/File')

module.exports = {
    redirect(req, res) {
        res.redirect("/admin/recipes")
    },

    async index(req, res) {
        const results = await Recipe.all()
        let recipes = results.rows

        const firstImagesPromise = recipes.map(recipe => Recipe.findFirstImage(recipe.id))
        const images = await Promise.all(firstImagesPromise)

        recipes = recipes.map((recipe, index) => ({
            ...recipe,
            image: `${req.protocol}://${req.headers.host}${images[index].rows[0].path.replace("public", "")}`
        }))

        return res.render("admin/recipes/index", { recipes })

    },
    
    async create(req, res) {
        const results = await Recipe.chefSelectOptions()
        const chefs = results.rows

        return res.render("admin/recipes/create", { chefs })    
    },
    
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != 'removed_files') {
                console.log(`${key} falhou`)
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        
        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id
        
        const filesPromise = req.files.map(file => File.create({ ...file }))
        results = await Promise.all(filesPromise)
        
        const recipeFilesPromise = results.map(file => File.createRecipeFile(recipeId, file.rows[0].id))
        await Promise.all(recipeFilesPromise)

        return res.redirect(`/admin/recipes/${recipeId}/`)
    },
    
    async show(req, res) {
        const recipeId = req.params.id

        let results = await Recipe.find(recipeId)
        const recipe = results.rows[0]

        results = await Recipe.findImages(recipe.id)
        const images = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes/recipe_info", { recipe, images })
    },
    
    async edit(req, res) {
        const recipeId = req.params.id
        
        let result = await Recipe.find(recipeId)
        const recipe = result.rows[0]

        result = await Recipe.chefSelectOptions()
        const chefs = result.rows

        result = await Recipe.findImages(recipeId)
        let images = result.rows

        images = images.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        if (!recipe) return res.send("A receita não existe")

        return res.render("admin/recipes/edit", { recipe, chefs, images })
    },
    
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            removedFiles.pop()

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        if (req.files.length != 0) {
            const oldFiles = await Recipe.findImages(req.body.id)
            const totalFiles = oldFiles.rows.length + req.files.length

            if (totalFiles <= 5) {
                const newFilesPromise = req.files.map(file => File.create({ ...file }))
                const results = await Promise.all(newFilesPromise)
                
                const recipeFilesPromise = results.map(file => File.createRecipeFile(req.body.id, file.rows[0].id))
                await Promise.all(recipeFilesPromise)
            }
        }

        await Recipe.update(req.body)
    
        return res.redirect(`recipes/${req.body.id}`)
    },
    
    delete(req, res) {
        const { id } = req.body
    
        Recipe.delete(id, () => {
            return res.redirect("/admin/recipes")
        })
    }
}