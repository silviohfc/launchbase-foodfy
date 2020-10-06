const fs = require('fs')
const data = require('../data.json')

exports.index = (req, res) => {
    return res.render("admin/index", { recipes: data.recipes })
}

exports.create = (req, res) => {
    return res.render("admin/create")
}

exports.post = (req, res) => {
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
}

exports.show = (req, res) => {
    const recipeId = req.params.id
    
    if(!data.recipes[recipeId - 1]) {
        res.send("A receita não existe")
    } else {
        res.render("admin/recipe_info", { recipe: data.recipes[recipeId - 1], recipeId })
    }
}

exports.edit = (req, res) => {
    const recipeId = req.params.id
    
    if(!data.recipes[recipeId - 1]) {
        res.send("A receita não existe")
    } else {
        res.render("admin/edit", { recipe: data.recipes[recipeId - 1], recipeId })
    }
}

exports.put = (req, res) => {
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
}

exports.delete = (req, res) => {
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