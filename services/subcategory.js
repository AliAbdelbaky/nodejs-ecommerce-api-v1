
const slugify = require('slugify')

const asyncHandler = require('express-async-handler')
const SubCategoryModel = require('../models/subCategory.model')
const ApiError = require('../utils/apiError')


exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body

    const doc = await SubCategoryModel.create({ name, slug: slugify(name), category })
    res.status(201).json({ data: doc })
})
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit

    const data = await SubCategoryModel
        .find({})
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name' })
    res.status(200).json({ total: data.length, page, limit, data })
})
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await SubCategoryModel.findById(id)
    if (data === null) {
        next(new ApiError(`No category for this id ${id}`, 404))
        return
    }
    res.status(200).json({ data })
})

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, category } = req.body

    const data = await SubCategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name), category }, { new: true })
    if (data === null) {
        next(new ApiError(`No sub category for this id ${id}`, 404))
    }
    res.status(200).json({ data })
})

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await SubCategoryModel.findByIdAndDelete(id)
    if (data === null) {
        next(new ApiError(`No sub category for this id ${id}`, 404))
    }
    res.status(200).json({ msg: 'deleted sucssefully', data })
})