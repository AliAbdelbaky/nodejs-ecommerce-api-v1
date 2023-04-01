const express = require('express')

const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    deleteSubCategory,
    updateSubCategory,
    setCategoryIdToBody
} = require('../services/subcategory')

const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require('../utils/validators/subcategory')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(getSubCategories)
    .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)

router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)



module.exports = router 