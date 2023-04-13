const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    createBrand,
    getBrandsList,
    getBrand,
    updateBrand,
    deleteBrand
} = require('../../services/brand')
const {
    createBrandValidator,
    getBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require("../../utils/validators/brand")
const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()

router
    .route('/')
    .get(getBrandsList)
    .post(protect, allowedTo('user'), uploadSingleImage('image'), resizeImageHandler('brand'), createBrandValidator, createBrand)
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(protect, allowedTo('user'), uploadSingleImage('image'), resizeImageHandler('brand'), updateBrandValidator, updateBrand)
    .delete(protect, allowedTo('user'), deleteBrandValidator, deleteBrand)


module.exports = router