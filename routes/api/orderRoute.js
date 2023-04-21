const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    createCashOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderPaid,
    updateOrderDeliverd
} = require('../../services/order')
const {
    getAllCartValidator,
    getSingleOrderValidator
} = require("../../utils/validators/order")

const router = express.Router()

router.use(protect)

router
    .route('/')
    .post(allowedTo('user'), createCashOrder)
router
    .get('/', allowedTo('admin', 'manager', 'user'), getAllCartValidator, getAllOrders)
    .get('/:id', getSingleOrderValidator, getSingleOrder)

router.put('/:id/pay',allowedTo('admin', 'manager'),updateOrderPaid)
router.put('/:id/deliver',allowedTo('admin', 'manager'),updateOrderDeliverd)
// router
//     .route('/:id')
//     .get(getBrandValidator, getBrand)
//     .put(protect, allowedTo('user'), uploadSingleImage('image'), resizeImageHandler('brand'), updateBrandValidator, updateBrand)
//     .delete(protect, allowedTo('user'), deleteBrandValidator, deleteBrand)


module.exports = router