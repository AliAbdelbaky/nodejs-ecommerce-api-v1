const express = require('express')
const router = express.Router()

const { createCategory, getCategory } = require('../services/category')

router.route('/').get(getCategory).post(createCategory)


module.exports = router 