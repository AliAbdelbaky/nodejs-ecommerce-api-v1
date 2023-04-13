const express = require('express')
const { protect, allowedTo } = require('../../services/auth')

const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    deleteSubCategory,
    updateSubCategory,
} = require('../../services/subcategory')

const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
    getSubCategoriesValidator
} = require('../../utils/validators/subcategory')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(getSubCategoriesValidator, getSubCategories)
    .post(protect, allowedTo('user'), createSubCategoryValidator, createSubCategory)

router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect, allowedTo('user'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('user'), deleteSubCategoryValidator, deleteSubCategory)



module.exports = router 