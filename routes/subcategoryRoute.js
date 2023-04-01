const express = require('express')

const router = express.Router()
// eslint-disable-next-line 
const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    deleteSubCategory,
    updateSubCategory
} = require('../services/subcategory')

const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require('../utils/validators/subcategory')


router
    .route('/')
    .get(getSubCategories)
    .post(createSubCategoryValidator, createSubCategory)

router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)



module.exports = router 