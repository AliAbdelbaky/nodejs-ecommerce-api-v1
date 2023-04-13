const express = require('express')
const { protect, allowedTo } = require('../../services/auth')


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
    .post(protect, allowedTo('user'), uploadMixImage('image', 'galary'), resizeImageHandler('product', 'many_single'), createProductValidator, createProduct)
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('user'), updateProductValidator, updateProduct)
    .delete(protect, allowedTo('user'), deleteProductValidator, deleteProduct)


module.exports = router