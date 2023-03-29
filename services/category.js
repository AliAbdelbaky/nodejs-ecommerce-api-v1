const CategoryModel = require('../models/category.model')
const slugify = require('slugify')

const asyncHandler = require('express-async-handler')


exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit

    const data = await CategoryModel.find({}).skip(skip).limit(limit)
    res.status(200).json({ total: data.length, page, limit, data })
})

exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await CategoryModel.findById(id)
    if (!data) {
        res.status(404).json({ msg: `No category for this id ${id}` })
    }
    res.status(200).json({ data })

})


exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name

    const doc = await CategoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: doc })
})

exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    const data = await CategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
    if (!data) {
        res.status(404).json({ msg: `No category for this id ${id}` })
    }
    res.status(200).json({ data })
})

exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await CategoryModel.findByIdAndDelete(id)
    res.status(200).json({ msg: 'deleted sucssefully', data })
})