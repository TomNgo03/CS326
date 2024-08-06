const productService = require('../services/productService');

async function getAllProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

async function getProductById(req, res) {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
}

async function updateProduct(req, res) {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
}

async function deleteProduct(req, res) {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
