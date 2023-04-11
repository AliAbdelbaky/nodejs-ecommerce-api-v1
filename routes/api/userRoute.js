const express = require('express')
const {
    createUser,
    getUsersList,
    getUser,
    updateUser,
    deleteUser
} = require('../../services/user')
const {
    createBrandValidator,
    getBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require("../../utils/validators/brand")


const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()

router
    .route('/')
    .get(getUsersList)
    .post(uploadSingleImage('image'), resizeImageHandler('users'), createUser)
router
    .route('/:id')
    .get(getUser)
    .put(uploadSingleImage('image'), resizeImageHandler('users'), updateUser)
    .delete(deleteUser)


module.exports = router