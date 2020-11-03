const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS author
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY id ASC
        `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    create(data) {
        const query = `
        INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.steps,
            data.information
        ]

        return db.query(query, values)
    },

    find(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS author
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `, [id], (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    update(data, callback) {
        const query = `
        UPDATE recipes SET
            image=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5),
            chef_id=($6)
        WHERE id = $7
        `

        const values = [
            data.image,
            data.title,
            data.ingredients,
            data.steps,
            data.information,
            data.chef_id,
            data.id
        ]

        console.log(values)

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },

    delete(id, callback) {
        db.query(`
        DELETE FROM recipes
        WHERE id = $1
        `, [id], (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },

    chefSelectOptions(callback) {
        db.query(`
        SELECT name, id
        FROM chefs
        ORDER BY chefs.name ASC
        `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    findByName(name, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS author
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${name}%'
        `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    paginate(params) {
        const { search, limit, offset, callback } = params

        let query = "",
            searchQuery = "",
            totalQuery = `(SELECT count(*) FROM recipes) AS total` 


        if (search) {
            searchQuery = `
            WHERE recipes.title ILIKE '%${search}%'            
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${searchQuery}
            ) AS total`
        }

        query = `
        SELECT recipes.*, ${totalQuery}, chefs.name AS author 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${searchQuery}
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}