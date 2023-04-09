
const slugify = require('slugify')

const asyncHandler = require('express-async-handler')
const SubCategoryModel = require('../models/subCategory.model')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeatures')

const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId
    next()
}

const createSubCategory = asyncHandler(async (req, res) => {

    const { name, category } = req.body

    const doc = await SubCategoryModel
        .create(
            {
                name,
                slug: slugify(name),
                category
            }
        )
    res.status(201).json({ data: doc })
})
const getSubCategories = asyncHandler(async (req, res) => {

    const totalDocuments = await SubCategoryModel.countDocuments()

    const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
        .paginate(totalDocuments)
        .filter()
        .search()
        .limitFields()
        .sort()
        .populate({ path: 'category', select: 'name' })


    const { mongooseQuery, paginationResult } = apiFeatures
    const data = await mongooseQuery
    res.status(200).json({ paginationResult, result: data.length, total: totalDocuments, data })

})



const getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await SubCategoryModel.findById(id)
    if (data === null) {
        next(new ApiError(`No category for this id ${id}`, 404))
        return
    }
    res.status(200).json({ data })
})

const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, category } = req.body

    const data = await SubCategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name), category }, { new: true })
    if (data === null) {
        next(new ApiError(`No sub category for this id ${id}`, 404))
    }
    res.status(200).json({ data })
})

const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await SubCategoryModel.findByIdAndDelete(id)
    if (data === null) {
        next(new ApiError(`No sub category for this id ${id}`, 404))
    }
    res.status(200).json({ msg: 'deleted sucssefully', data })
})

module.exports = {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody
}