const CategoryModel = require('../models/category.model')
const slugify = require('slugify')

const asyncHandler = require('express-async-handler')


exports.getCategory = asyncHandler(async (req, res) => {
    const data = await CategoryModel.find({})
    res.status(200).json({ total: data.length, data })
})


exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name

    const doc = await CategoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: doc })
})