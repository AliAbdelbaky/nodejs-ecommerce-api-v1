const express = require('express')
const {
    createUser,
    getUsersList,
    getUser,
    updateUser,
    deleteUser,
    changeUserPassword
} = require('../../services/user')
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    updateUserPassword
} = require("../../utils/validators/user")


const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()

router.put('/changePassword/:id', updateUserPassword, changeUserPassword)

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