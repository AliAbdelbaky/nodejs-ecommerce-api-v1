// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');
const factory = require('../utils/handlersFactory')
const CategoryModel = require('../models/category.model');
const ApiError = require('../utils/apiError');

// DiskStroage engine 
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/category')
    },
    filename: function (req, file, cb) {
        // category-${id}-Date.Now()[extension]
        const ext = file.mimetype.split('/')[1]
        const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
        cb(null, filename)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new ApiError('Only Images allowed', 400), false)
    }
}
const uploadCategoryImage = multer({ storage: multerStorage, fileFilter: multerFilter }).single('image')




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
    uploadCategoryImage
}