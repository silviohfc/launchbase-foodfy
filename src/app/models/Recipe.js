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

    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS author
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
        `, [id])
    },

    update(data) {
        const query = `
        UPDATE recipes SET
            title=($1),
            ingredients=($2),
            preparation=($3),
            information=($4),
            chef_id=($5)
        WHERE id = $6
        `

        const values = [
            data.title,
            data.ingredients,
            data.steps,
            data.information,
            data.chef_id,
            data.id
        ]

        return db.query(query, values)
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

    findImages(recipeId) {
        return db.query(`
            SELECT * 
            FROM files
            LEFT JOIN recipe_files ON recipe_files.file_id = files.id
            WHERE recipe_files.recipe_id = $1
        `, [recipeId])
    },

    chefSelectOptions() {
        return db.query(`
            SELECT name, id
            FROM chefs
            ORDER BY chefs.name ASC
        `)
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