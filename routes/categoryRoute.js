const express = require('express')
const router = express.Router()

const { createCategory } = require('../services/category')

router.get('/', createCategory)


module.exports = router 