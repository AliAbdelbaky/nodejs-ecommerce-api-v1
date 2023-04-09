const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const ApiError = require('../utils/apiError');

const getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await Product.findById(id).populate({ path: 'category', select: 'name' })
    if (!data) {
        next(new ApiError(`No Product found for id  ${id}`, 404))
    }
    res.status(200).json({ data })
})
const getProductsList = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludeFields = ['page', 'limit', 'sort', 'fields']
    excludeFields.forEach(field => delete queries[field])

    const queryStr = JSON.parse(
        JSON.stringify(queries)
            .replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    )

    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit




    const mongooseQuery = Product.find(queryStr)
        .limit(limit)
        .skip(skip)
        .populate({ path: 'category', select: 'name' })

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        mongooseQuery.sort(sortBy)
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        mongooseQuery.select(fields)
    }
    // fix search 
    // if (req.query.search) {
    //     const query = {}
    //     query.$or = [{ title: { $regex: req.query.search, $options: "i" } }, { description: { $regex: req.query.search, $options: "i" } }]
    //     mongooseQuery.find(query)
    // }
    const data = await mongooseQuery


    res.status(200).json({ page, limit, total: data.length, data })
})

const createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title)
    const data = await Product.create(req.body)
    res.status(201).json({ data })
})

const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
    }
    const data = await Product.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    if (data === null) {
        next(new ApiError(`No Product for this id ${id}`, 404))
        return
    }
    res.status(200).json({ data })
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = await Product.findByIdAndDelete({ _id: id })
    if (data === null) {
        next(new ApiError(`No Product for this id ${id}`, 404))
    }
    res.status(200).json({ data, msg: 'Product deleted sucssefuly' })
})

module.exports = {
    getProduct,
    getProductsList,
    createProduct,
    updateProduct,
    deleteProduct
}
