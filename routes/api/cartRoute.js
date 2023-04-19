const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    addProductToCart,
    getUserCart,
    removeCartItem,
    removeCart,
    updateProductQuantity
} = require('../../services/cart')
const {
    createCartValidator
} = require("../../utils/validators/cart")
// const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()
router.use(protect, allowedTo('user'))
router
    .route('/')
    .post(createCartValidator, addProductToCart)
    .get(getUserCart)
    .delete(removeCart)
router
    .route('/:id')
    .put(updateProductQuantity)
    .delete(removeCartItem)


module.exports = router