const express = require('express')

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
    .post(createSubCategoryValidator, createSubCategory)

router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)



module.exports = router 