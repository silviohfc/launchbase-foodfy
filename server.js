const express = require('express')

const server = express()



server.get("/", (req, res) => {
    return res.send("Hello world!")
})



server.listen(5000, () => {
    console.log("Server is Running...")
})