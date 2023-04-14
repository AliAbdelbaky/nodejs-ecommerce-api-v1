const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    createUser,
    getUsersList,
    getUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    getLoggedUser,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deactivateAccount
} = require('../../services/user')
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    updateUserPassword,
    updateLoggedUserPasswordValidator,
    updateLoggedUserValidator,
    updateLoggedUserActive
} = require("../../utils/validators/user")


const { uploadSingleImage, resizeImageHandler } = require('../../middleware/imageMiddleware');

const router = express.Router()

router.use(protect)

router.get('/me', getLoggedUser, getUser)
router.put('/me/updatePassword', updateLoggedUserPasswordValidator, updateLoggedUserPassword)
router.put('/me/updateData', uploadSingleImage('image'), resizeImageHandler('users'), updateLoggedUserValidator, updateLoggedUserData)
router.put('/me/changeActive', updateLoggedUserActive, deactivateAccount)

router.use(protect, allowedTo('admin'))

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