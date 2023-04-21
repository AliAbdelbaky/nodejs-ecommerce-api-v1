const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    createCashOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderPaid,
    updateOrderDeliverd,
    checkoutSession
} = require('../../services/order')
const {
    getAllCartValidator,
    getSingleOrderValidator
} = require("../../utils/validators/order")

const router = express.Router()

router.use(protect)

router.get('/checkout-session', allowedTo('user'), checkoutSession)

router
    .route('/')
    .post(allowedTo('user'), createCashOrder)
router
    .get('/', allowedTo('admin', 'manager', 'user'), getAllCartValidator, getAllOrders)
    .get('/:id', getSingleOrderValidator, getSingleOrder)

router
    .put('/:id/pay', allowedTo('admin', 'manager'), updateOrderPaid)
    .put('/:id/deliver', allowedTo('admin', 'manager'), updateOrderDeliverd)


module.exports = router