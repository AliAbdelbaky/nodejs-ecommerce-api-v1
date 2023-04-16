const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    addProductToWishlist,
    getAllWishlist,
    deleteProductToWishlist
} = require('../../services/wishlist')
const {
    addProductValidator,
    removeProductValidator
} = require("../../utils/validators/wishlist");

const router = express.Router()
router.use(protect, allowedTo('user'))

router
    .route('/')
    .get(getAllWishlist)
    .post(addProductValidator, addProductToWishlist)
router
    .route('/:productId')
    .delete(removeProductValidator, deleteProductToWishlist)


module.exports = router