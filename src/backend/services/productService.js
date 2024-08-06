const { productDb } = require('../db/pouchdb');

async function getAllProducts() {
    const result = await productDb.allDocs({ include_docs: true });
    return result.rows.map(row => row.doc);
}

async function getProductById(id) {
    try {
        const product = await productDb.get(id);
        return product;
    } catch (error) {
        throw new Error('Product not found');
    }
}

async function createProduct(productData) {
    const product = { ...productData, _id: new Date().toISOString() };
    const response = await productDb.put(product);
    return { ...product, _rev: response.rev };
}

async function updateProduct(id, productData) {
    const product = await getProductById(id);
    const updatedProduct = { ...product, ...productData };
    const response = await productDb.put(updatedProduct);
    return { ...updatedProduct, _rev: response.rev };
}

async function deleteProduct(id) {
    const product = await getProductById(id);
    await productDb.remove(product);
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
