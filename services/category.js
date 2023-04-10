
const slugify = require('slugify')

const asyncHandler = require('express-async-handler')
const CategoryModel = require('../models/category.model')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeatures')
const factory = require('./handlersFactory')

const getCategories = asyncHandler(async (req, res) => {
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

const getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await CategoryModel.findById(id)
    if (data === null) {
        next(new ApiError(`No category for this id ${id}`, 404))
        return
    }
    res.status(200).json({ data })
})


const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body

    const doc = await CategoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: doc })
})

const updateCategory = factory.updateOne(CategoryModel)

const deleteCategory = factory.deleteOne(CategoryModel)

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}