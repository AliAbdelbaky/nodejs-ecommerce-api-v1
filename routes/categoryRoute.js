const express = require('express')
const router = express.Router()

const { createCategory, getCategories, getCategory, updateCategory,deleteCategory } = require('../services/category')

router.route('/').get(getCategories).post(createCategory)
router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory)


module.exports = router 