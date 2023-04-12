const express = require('express')
const {
    createUser,
    getUsersList,
    getUser,
    updateUser,
    deleteUser
} = require('../../services/user')
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator
} = require("../../utils/validators/user")


const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()

router
    .route('/')
    .get(getUsersList)
    .post(uploadSingleImage('image'), resizeImageHandler('users'), createUserValidator, createUser)
router
    .route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadSingleImage('image'), resizeImageHandler('users'), updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser)


module.exports = router