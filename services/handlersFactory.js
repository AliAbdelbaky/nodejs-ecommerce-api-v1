const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures')

exports.deleteOne = Model => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete({ _id: id })

    if (document === null) {
        next(new ApiError(`No brand for this id ${id}`, 404))
    }
    res.status(200).json({ document, msg: 'brand deleted sucssefuly' })
})

exports.updateOne = Model => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    console.log(document)
    if (document === null) {
        next(new ApiError(`No ${Model} for this id ${req.params.id}`, 404))
        return
    }
    res.status(200).json({ data: document })
})




