const factory = require('../utils/handlersFactory')
const CategoryModel = require('../models/category.model');

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = factory.getAll(CategoryModel)

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategory = factory.getOne(CategoryModel)

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
const createCategory = factory.createOne(CategoryModel)

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
const updateCategory = factory.updateOne(CategoryModel)

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
const deleteCategory = factory.deleteOne(CategoryModel)

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
}