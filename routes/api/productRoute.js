const express = require('express')
const {
    createProduct,
    getProductsList,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../../services/product')
const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require("../../utils/validators/product")
const { uploadMixImage, resizeImageHandler } = require('../../middleware/imageMiddleware')

const router = express.Router()

router
    .route('/')
    .get(getProductsList)
    .post(uploadMixImage('image', 'galary'), resizeImageHandler('product', 'many_single'), createProductValidator, createProduct)
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)


module.exports = router