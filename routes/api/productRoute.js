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

const router = express.Router()

router
    .route('/')
    .get(getProductsList)
    .post(createProductValidator, createProduct)
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)


module.exports = router