const express = require('express')

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../services/category')

const { getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/category')

const subCategoryRoute = require('./subcategoryRoute')

const router = express.Router()

router.use('/:categoryId/subcategories', subCategoryRoute)

router
    .route('/')
    .get(getCategories)
    .post(createCategoryValidator, createCategory)
router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)


module.exports = router 