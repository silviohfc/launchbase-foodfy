const Chef = require("../../models/Chef")

module.exports = {
    index(req, res) {
        Chef.all(chefs => {
            return res.render("chefs/index", { chefs })
        })
    }
}