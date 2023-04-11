// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const ApiError = require('../utils/apiError');

const multerOptions = () => {
    const multerStorage = multer.memoryStorage()

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new ApiError('Only Images allowed', 400), false)
        }
    }
    return {
        multerStorage,
        multerFilter
    }
}
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
    const { multerFilter, multerStorage } = multerOptions()

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

    return upload.single(fieldName)

}
const uploadMixImage = (singleFieldName, manyFieldName, manyCount = 5) => {

    // 2- Memory Storage engine
    const { multerFilter, multerStorage } = multerOptions()


    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

    return upload.fields([
        { name: singleFieldName, maxCount: 1 },
        { name: manyFieldName, maxCount: manyCount },
    ])

}



const resizeImageHandler = (modelName, type = 'single', w = 600, h = 600, q = 95) => {
    const callbacks = {
        'single': async (req, res) => {
            // ${modelName}-${id}-Date.Now().jpeg
            const filename = `${modelName}-${uuidv4()}-${Date.now()}.jpeg`

            const { file } = req

            if (file) {
                await sharp(file.buffer)
                    .resize(w, h)
                    .toFormat("jpeg")
                    .jpeg({ quality: q })
                    .toFile(`uploads/${modelName}/${filename}`);
                req.body.image = filename
            }
        },
        'many_single': async (req, res) => {

            let singleField = []
            let manyField = []
            const { files } = req
            if (files) {

                Object.keys(req.files).forEach(key => {
                    if (req.files[key].length === 1) {
                        singleField = req.files[key]
                    } else {
                        manyField = req.files[key]
                    }
                })

                if (singleField.length) {
                    const img = singleField[0]
                    const filename = `${modelName}-${uuidv4()}-${Date.now()}.jpeg`

                    await sharp(img.buffer)
                        .resize(2000, 1333)
                        .toFormat("jpeg")
                        .jpeg({ quality: q })
                        .toFile(`uploads/${modelName}/${filename}`);
                    req.body[img.fieldname] = filename

                }
                if (manyField.length) {
                    req.body[manyField[0].fieldname] = []
                    await Promise.all(
                        manyField.map(async (img, index) => {
                            const filename = `${modelName}-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
                            await sharp(img.buffer)
                                .resize(w, h)
                                .toFormat("jpeg")
                                .jpeg({ quality: q })
                                .toFile(`uploads/${modelName}/${filename}`);
                            req.body[img.fieldname].push(filename)
                        })
                    )
                }
            }
        },
    }
    const cb = asyncHandler(async (req, res, next) => {
        if (['single', 'many_single'].includes(type)) {
            await callbacks[type](req, res)
        } else {
            next(new ApiError(`invalid type ${type}`, 400))
            return
        }
        next()
    })
    return cb
}


module.exports = {
    uploadSingleImage,
    resizeImageHandler,
    uploadMixImage
}