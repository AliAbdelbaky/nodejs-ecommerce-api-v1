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

const router = express.Router()

router
    .route('/')
    .get(getBrandsList)
    .post(createBrandValidator, createBrand)
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router