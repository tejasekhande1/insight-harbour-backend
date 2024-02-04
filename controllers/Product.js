const Product = require('../models/Product');
const Review = require('../models/Review');

exports.addProduct = async (req, res) => {
    try {
        const { name, category, description, brand, price } = req.body;
        if (!name || !category || !description || !brand || !price) {
            return res.status(400).json({
                success: false,
                message: `All fields are required`,
            });
        }

        const existingProduct = await Product.findOne({ name: name });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: `Product already exists`,
            });
        }

        const product = await Product.create({
            name,
            category,
            description,
            brand,
            price
        });

        return res.status(200).json({
            success: true,
            message: "Product Added Successfully",
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add new product",
            error: error
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, category, description, brand, price } = req.body;

        if (!name || !category || !description || !brand || !price) {
            return res.status(400).json({
                success: false,
                message: `All fields are required`,
            });
        }

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: `Product not found`,
            });
        }

        existingProduct.name = name;
        existingProduct.category = category;
        existingProduct.description = description;
        existingProduct.brand = brand;
        existingProduct.price = price;

        await existingProduct.save();

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            data: existingProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update the product",
            error: error
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: `Product not found`,
            });
        }

        await Product.findByIdAndDelete(productId)

        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete the product",
            error: error
        });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;

        const products = await Product.find({ category: category });

        return res.status(200).json({
            success: true,
            message: "Products Retrieved Successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products by category",
            error: error
        });
    }
};

exports.searchProducts = async (req, res) => {
    try {

        const searchQuery = req.query.q;

        console.log("Search Query -> ", searchQuery);

        if (!searchQuery) {
            return res.status(400).json({
                success: false,
                message: 'Search query parameter (q) is required',
            });
        }

        const regex = new RegExp(searchQuery, 'i');

        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { category: { $regex: regex } },
                { description: { $regex: regex } },
                { brand: { $regex: regex } }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Products Retrieved Successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products by search query",
            error: error
        });
    }
};

exports.searchProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const searchQuery = req.query.q;

        if (!searchQuery) {
            return res.status(400).json({
                success: false,
                message: 'Search query parameter (q) is required',
            });
        }

        const regex = new RegExp(searchQuery, 'i');

        const products = await Product.find({
            $and: [
                { category: category },
                {
                    $or: [
                        { name: { $regex: regex } },
                        { description: { $regex: regex } },
                        { brand: { $regex: regex } }
                    ]
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Products Retrieved Successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products by search query",
            error: error
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            success: true,
            message: "Products Retrieved Successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products",
            error: error
        });
    }
};

exports.getProductsByBrandName = async (req, res) => {
    try {
        const brandName = req.params.brandName;

        const products = await Product.find({ brand: brandName });

        return res.status(200).json({
            success: true,
            message: "Products Retrieved Successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products by brand name",
            error: error
        });
    }
};