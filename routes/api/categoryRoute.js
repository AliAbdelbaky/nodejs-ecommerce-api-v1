const express = require('express')

const { protect, allowedTo } = require('../../services/auth')
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require('../../services/category')

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../../utils/validators/category')

const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');



const subCategoryRoute = require('./subcategoryRoute')

const router = express.Router()

router.use('/:categoryId/subcategories', subCategoryRoute)

router
    .route('/')
    .get(getCategories)
    .post(protect, allowedTo('user', 'admin'), uploadSingleImage('image'), resizeImageHandler('category'), createCategoryValidator, createCategory)
router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(protect, allowedTo('user', 'admin'), uploadSingleImage('image'), resizeImageHandler('category'), updateCategoryValidator, updateCategory)
    .delete(protect, allowedTo('user', 'admin'), deleteCategoryValidator, deleteCategory)


module.exports = router 