const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand.model');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures')
const factory = require('./handlersFactory')

const getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await Brand.findById(id)
    if (!data) {
        next(new ApiError(`No brand found for id  ${id}`, 404))
    }
    res.status(200).json({ data })
})
const getBrandsList = asyncHandler(async (req, res) => {
    const totalDocuments = await Brand.countDocuments()

    const apiFeatures = new ApiFeatures(Brand.find(), req.query)
        .paginate(totalDocuments)
        .filter()
        .search()
        .limitFields()
        .sort()


    const { mongooseQuery, paginationResult } = apiFeatures
    const data = await mongooseQuery
    res.status(200).json({ paginationResult, result: data.length, total: totalDocuments, data })
})

const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const data = await Brand.create({ name, slug: slugify(name) })
    res.status(201).json({ data })
})

const updateBrand = factory.updateOne(Brand)

const deleteBrand = factory.deleteOne(Brand)

module.exports = {
    getBrand,
    getBrandsList,
    createBrand,
    updateBrand,
    deleteBrand
}
