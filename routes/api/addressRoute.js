const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    addAddress,
    deleteAdress,
    getAllAddresses,
    getSpecificAddress
} = require('../../services/address')
const {
    addAddressValidator,
    removeAddressValidator
} = require("../../utils/validators/address");

const router = express.Router()
router.use(protect, allowedTo('user'))

router
    .route('/')
    .get(getAllAddresses)
    .post(addAddressValidator, addAddress)
router
    .route('/:addressId')
    .get(removeAddressValidator, getSpecificAddress)
    .delete(removeAddressValidator, deleteAdress)


module.exports = router