require('dotenv').config(); // Load environment variables from .env file
const { dbConnect } = require("./config/database");
const userRoutes = require("./routes/User");
const productRoutes = require('./routes/Product')

const express = require('express')
const app = express()
app.use(express.json());


const PORT = process.env.PORT
dbConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})