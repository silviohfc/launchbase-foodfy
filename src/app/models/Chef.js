const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all() {
        try {
            return db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes, files.path AS avatar_path
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                LEFT JOIN files ON (files.id = chefs.file_id)
                GROUP BY chefs.id, files.id
                ORDER BY total_recipes DESC
            `)
        }

        catch (err) {
            console.log(err)
        }
    },

    create(name, fileId) {
        try {
            const query = `
                INSERT INTO chefs (
                    file_id,
                    name
                ) VALUES ($1, $2)
                RETURNING id
            `

            const values = [
                fileId,
                name
            ]

            return db.query(query, values)

        } catch(err) {
            console.log(err)
        }
    },

    find(id) {
        return db.query(`
            SELECT chefs.*, files.path AS avatar_path
            FROM chefs
            LEFT JOIN files ON (files.id = chefs.file_id)
            WHERE chefs.id = $1
            `, [id])
    },

    findRecipes(id) {
        return db.query(`
            SELECT recipes.*
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.chef_id = $1
        `, [id])
    },

    update(id, name, fileId) {
        try {
            let query = `
                UPDATE chefs SET
                    name=('${name}')
            `
            if (fileId) {
                query = `
                    ${query},
                    file_id=(${fileId})
                `
            }

            query = `
                ${query}
                WHERE id = ${id}
            `

            return db.query(query)

        }

        catch (err) {
            console.log(err)
        }
        
    },

    delete(id, callback) {
        db.query(`
        DELETE FROM chefs
        WHERE id = $1
        `, [id], (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    }
}