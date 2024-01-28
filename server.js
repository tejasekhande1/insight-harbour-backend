require('dotenv').config(); // Load environment variables from .env file
const { dbConnect } = require("./config/database");


const express = require('express')
const app = express()
app.use(express.json());


const PORT = process.env.PORT
dbConnect();

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})