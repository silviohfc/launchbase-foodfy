module.exports = {
    index(req, res) {
        return res.render("admin/chefs/index")
    },
    
    create(req, res) {
        return res.render("admin/recipes/create")
    },
    
    post(req, res) {
        let { image, title, author, ingredients, steps, information } = req.body
    
        data.recipes.push({
            image,
            title,
            author,
            ingredients,
            steps,
            information
        })
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
            if (err) return res.send("Write file error!")
    
            return res.redirect("/admin/recipes")
        })
    },
    
    show(req, res) {
        const recipeId = req.params.id
        
        if(!data.recipes[recipeId - 1]) {
            res.send("A receita não existe")
        } else {
            res.render("admin/recipes/recipe_info", { recipe: data.recipes[recipeId - 1], recipeId })
        }
    },
    
    edit(req, res) {
        const recipeId = req.params.id
        
        if(!data.recipes[recipeId - 1]) {
            res.send("A receita não existe")
        } else {
            res.render("admin/recipes/edit", { recipe: data.recipes[recipeId - 1], recipeId })
        }
    },
    
    put(req, res) {
        const { id, image, title, author, ingredients, steps, information } = req.body
        
        data.recipes[id - 1] = {
            image,
            title,
            author,
            ingredients,
            steps,
            information
        }
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
            if (err) return res.send("Write file error!")
    
            return res.redirect(`/admin/recipes/${id}`)
        })
    },
    
    delete(req, res) {
        const { id } = req.body
    
        const filteredRecipes = data.recipes.filter((recipe, i) => {
            return i != id - 1
        })
    
        data.recipes = filteredRecipes
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
            if (err) return res.send("Write file error!")
    
            return res.redirect("/admin/recipes")
        })
    }
}