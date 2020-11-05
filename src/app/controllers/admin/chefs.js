const Chef = require('../../models/Chef')
const File = require('../../models/File')

module.exports = {
    index(req, res) {
        Chef.all(chefs => {
            return res.render("admin/chefs/index", { chefs })
        })
    },
    
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        let results = await File.create(req.files[0])
        const fileId = results.rows[0].id

        results = await Chef.create(req.body.name, fileId)
        const chefId = results.rows[0].id

        return res.redirect(`/admin/chefs/${chefId}`)
    },
    
    async show(req, res) {
        const chefId = req.params.id

        let results = await Chef.find(chefId)
        let chef = results.rows[0]

        if (!chef) return res.send("O chef não existe")

        results = await Chef.findRecipes(chefId)
        const recipes = results.rows

        chef = {
            ...chef,
            recipes,
            total_recipes: recipes.length
        }

        return res.render("admin/chefs/chef_info", { chef })

    },
    
    async edit(req, res) {
        const chefId = req.params.id

        let results = await Chef.find(chefId)
        const chef = {
            ...results.rows[0],
            avatar_path: `${req.protocol}://${req.headers.host}${results.rows[0].avatar_path.replace("public", "")}`
        }

        if (!chef) return res.send("O chef não existe")

        return res.render("admin/chefs/edit", { chef })
    },
    
    async put(req, res) {
        const keys = Object.keys(req.body)
        const { id, name, file_id } = req.body

        for (key of keys) {
            if (req.body[key] == "" && key != "image") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        if (req.files.length == 0) {
            await Chef.update(id, name)
            return res.redirect(`chefs/${id}`)
        }

    
        let results = await File.create(req.files[0])
        const newAvatar = results.rows[0]

        await Chef.update(id, name, newAvatar.id) 

        await File.delete(file_id)

        return res.redirect(`chefs/${id}`)
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