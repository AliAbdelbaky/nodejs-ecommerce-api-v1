const factory = require('../utils/handlersFactory')
const Brand = require('../models/brand.model');


// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
const getBrandsList = factory.getAll(Brand)

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
const getBrand = factory.getOne(Brand)

// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
const createBrand = factory.createOne(Brand)

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
const updateBrand = factory.updateOne(Brand)

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
const deleteBrand = factory.deleteOne(Brand)

module.exports = {
    getBrand,
    getBrandsList,
    createBrand,
    updateBrand,
    deleteBrand
}
