const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures')



const getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await Product.findById(id).populate({ path: 'category', select: 'name' })
    if (!data) {
        next(new ApiError(`No Product found for id  ${id}`, 404))
    }
    res.status(200).json({ data })
})
const getProductsList = asyncHandler(async (req, res) => {

    const totalDocuments = await Product.countDocuments()

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .paginate(totalDocuments)
        .filter()
        .search('Products')
        .limitFields()
        .sort()
        .populate({ path: 'category', select: 'name' })


    const { mongooseQuery, paginationResult } = apiFeatures
    const data = await mongooseQuery


    res.status(200).json({ paginationResult, total: totalDocuments, results: data.length, data })


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
