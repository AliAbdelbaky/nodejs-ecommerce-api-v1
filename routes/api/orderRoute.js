const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    createCashOrder
} = require('../../services/order')
// const {
//     createBrandValidator,
//     getBrandValidator,
//     updateBrandValidator,
//     deleteBrandValidator
// } = require("../../utils/validators/brand")
// const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()

router.use(protect, allowedTo('user'),)
router
    .route('/')
    .post(createCashOrder)
// router
//     .route('/:id')
//     .get(getBrandValidator, getBrand)
//     .put(protect, allowedTo('user'), uploadSingleImage('image'), resizeImageHandler('brand'), updateBrandValidator, updateBrand)
//     .delete(protect, allowedTo('user'), deleteBrandValidator, deleteBrand)


module.exports = router