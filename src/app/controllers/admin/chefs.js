const Chef = require('../../models/Chef')

module.exports = {
    index(req, res) {
        Chef.all(chefs => {
            return res.render("admin/chefs/index", { chefs })
        })
    },
    
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    
    post(req, res) {
        Chef.create(req.body, chef => {
            return res.redirect(`/admin/chefs/${ chef.id }`)
        })
    },
    
    show(req, res) {
        const chefId = req.params.id

        Chef.find(chefId, chef => {
            if (!chef) return res.send("O chef não existe")

            Chef.findRecipes(chef.id, recipes => {
                
                chef = {
                    ...chef,
                    recipes: recipes,
                    total_recipes: recipes.length
                }

                return res.render("admin/chefs/chef_info", { chef })
            })

        })

    },
    
    edit(req, res) {
        const chefId = req.params.id
        
        Chef.find(chefId, chef => {
            if (!chef) return res.send("O chef não existe")

            return res.render("admin/chefs/edit", { chef })
        })
    },
    
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }
    
        Chef.update(req.body, () => {
            return res.redirect(`chefs/${req.body.id}`)
        })
    },
    
    delete(req, res) {
        const { id } = req.body
    
        Chef.findRecipes(id, recipes => {
            if (recipes.length > 0) return res.send("Erro: não é possível deletar chefs que ainda possuem receitas!")

            Chef.delete(id, () => {
                return res.redirect("/admin/chefs")
            })
        })
        
    }
}