const asyncHandler = require('express-async-handler');
const ApiError = require('./apiError');
const ApiFeatures = require('./apiFeatures')

const deleteOne = Model => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete({ _id: id })

    if (document === null) {
        next(new ApiError(`No document for this id ${id}`, 404))
        return
    }
    document.remove()
    res.status(200).json({ document, msg: 'document deleted sucssefuly' })
})

const updateOne = Model => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    if (document === null) {
        next(new ApiError(`No document for this id ${req.params.id}`, 404))
        return
    }
    document.save()
    res.status(200).json({ data: document })
})

const createOne = Model => asyncHandler(async (req, res) => {
    const document = await Model.create(req.body)
    res.status(201).json({ data: document })
})

const getOne = (Model, populateOpt) => asyncHandler(async (req, res, next) => {

    let query = Model.findById(req.params.id)
    if (populateOpt) {
        query = query.populate(populateOpt)
    }
    const document = await query
    if (document === null) {
        next(new ApiError(`No document found for id  ${req.params.id}`, 404))
        return
    }
    res.status(200).json({ data: document })
})

const getAll = (Model, modelname = '') => asyncHandler(async (req, res) => {
    const totalDocuments = await Model.countDocuments()

    const apiFeatures = new ApiFeatures(Model.find(req.filterObj || {}), req.query)
        .paginate(totalDocuments)
        .filter()
        .search(modelname)
        .limitFields()
        .sort()


    const { mongooseQuery, paginationResult } = apiFeatures
    const data = await mongooseQuery

    res.status(200).json({ paginationResult, result: data.length, total: totalDocuments, data })
})

module.exports = {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
}



