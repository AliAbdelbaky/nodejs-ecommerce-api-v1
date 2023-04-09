
const slugify = require('slugify')

const asyncHandler = require('express-async-handler')
const CategoryModel = require('../models/category.model')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeatures')

exports.getCategories = asyncHandler(async (req, res) => {
    const totalDocuments = await CategoryModel.countDocuments()

    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
        .paginate(totalDocuments)
        .filter()
        .search()
        .limitFields()
        .sort()


    const { mongooseQuery, paginationResult } = apiFeatures
    const data = await mongooseQuery
    res.status(200).json({ paginationResult, result: data.length, total: totalDocuments, data })


})

exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await CategoryModel.findById(id)
    if (data === null) {
        next(new ApiError(`No category for this id ${id}`, 404))
        return
    }
    res.status(200).json({ data })
})


exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body

    const doc = await CategoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: doc })
})

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    const data = await CategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
    if (data === null) {
        next(new ApiError(`No category for this id ${id}`, 404))
    }
    res.status(200).json({ data })
})

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await CategoryModel.findByIdAndDelete(id)
    if (data === null) {
        next(new ApiError(`No category for this id ${id}`, 404))
    }
    res.status(200).json({ msg: 'deleted sucssefully', data })
})