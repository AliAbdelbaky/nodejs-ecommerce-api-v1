const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand.model');
const ApiError = require('../utils/apiError');

const getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await Brand.findById(id)
    if (!data) {
        next(new ApiError(`No brand found for id  ${id}`, 404))
    }
    res.status(200).json({ data })
})
const getBrandsList = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit
    const data = await Brand.find({}).limit(limit).skip(skip)
    res.status(200).json({ page, limit, total: data.length, data })
})

const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const data = await Brand.create({ name, slug: slugify(name) })
    res.status(201).json({ data })
})

const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const data = await Brand.findByIdAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
    if (data === null) {
        next(new ApiError(`No brand for this id ${id}`, 404))
        return
    }
    res.status(200).json({ data })
})

const deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await Brand.findByIdAndDelete({ _id: id })
    if (data === null) {
        next(new ApiError(`No brand for this id ${id}`, 404))
    }
    res.status(200).json({ data, msg: 'brand deleted sucssefuly' })
})

module.exports = {
    getBrand,
    getBrandsList,
    createBrand,
    updateBrand,
    deleteBrand
}
