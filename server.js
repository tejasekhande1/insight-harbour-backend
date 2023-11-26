require('dotenv').config(); // Load environment variables from .env file

const express = require('express')
const app = express()

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})