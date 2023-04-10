const factory = require('../utils/handlersFactory')
const SubCategoryModel = require('../models/subCategory.model')



// Nested route
// GET /api/v1/categories/:categoryId/subcategories


// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSubCategory = factory.getOne(SubCategoryModel)

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
const getSubCategories = factory.getAll(SubCategoryModel)

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
const createSubCategory = factory.createOne(SubCategoryModel)

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
const updateSubCategory = factory.updateOne(SubCategoryModel)

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
const deleteSubCategory = factory.deleteOne(SubCategoryModel)

module.exports = {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
}