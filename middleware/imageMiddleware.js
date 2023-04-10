// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const ApiError = require('../utils/apiError');


const uploadSingleImage = (fieldName) => {
    // 1- DiskStroage engine 
    // const multerStorage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/category')
    //     },
    //     filename: function (req, file, cb) {
    //         // category-${id}-Date.Now()[extension]
    //         const ext = file.mimetype.split('/')[1]
    //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
    //         cb(null, filename)
    //     }
    // })

    // 2- Memory Storage engine
    const multerStorage = multer.memoryStorage()

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new ApiError('Only Images allowed', 400), false)
        }
    }

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

    return upload.single(fieldName)

}

const resizeImageHandler = (modelName, w = 600, h = 600, q = 95) => {

    const cb = asyncHandler(async (req, res, next) => {
        // ${modelName}-${id}-Date.Now().jpeg
        const filename = `${modelName}-${uuidv4()}-${Date.now()}.jpeg`

        const { file } = req

        if (file) {
            sharp(file.buffer)
                .resize(w, h)
                .toFormat("jpeg")
                .jpeg({ quality: q })
                .toFile(`uploads/${modelName}/${filename}`);
            req.body.image = filename
        }
        next()
    })
    return cb
}


module.exports = {
    uploadSingleImage,
    resizeImageHandler
}