const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require("./data")

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server
})

// ROUTES
server.get("/", (req, res) => {
    return res.render("index")
})

server.get("/about", (req, res) => {
    return res.render("about")
})

server.get("/recipes", (req, res) => {
    return res.render("recipes", { recipes })
})

server.get("/recipes/:index", (req, res) => {
    const recipeIndex = req.params.index
    if (!recipes[recipeIndex-1]) {
        return res.send("A receita não existe!")
    }else {
        return res.render("recipe_info", { recipe: recipes[recipeIndex-1] })
    }

    
})



server.listen(5000, () => {
    console.log("Server is Running...")
})