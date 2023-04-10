const express = require('express')
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
    .post(uploadSingleImage('image'), resizeImageHandler('brand'), createBrandValidator, createBrand)
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(uploadSingleImage('image'), resizeImageHandler('brand'),updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router