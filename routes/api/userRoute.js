const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


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
    .get(protect, allowedTo('user'), getUsersList)
    .post(protect, allowedTo('user'), uploadSingleImage('image'), resizeImageHandler('users'), createUserValidator, createUser)
router
    .route('/:id')
    .get(protect, allowedTo('user'), getUserValidator, getUser)
    .put(protect, allowedTo('user'), uploadSingleImage('image'), resizeImageHandler('users'), updateUserValidator, updateUser)
    .delete(protect, allowedTo('user'), deleteUserValidator, deleteUser)


module.exports = router