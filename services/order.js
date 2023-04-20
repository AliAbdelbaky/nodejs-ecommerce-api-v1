const asyncHandler = require('express-async-handler');
const factory = require('../utils/handlersFactory')
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/apiError');


// @desc    create cash order 
// @route   POST /api/v1/orders
// @access  Private/User
const createCashOrder = asyncHandler(async (req, res, next) => {
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0


    // 1 - get cart depend on user cart id 
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        return next(new ApiError('There is no cart', 404))
    }

    // 2 - get order total price depend on cart price "if coupon applied"
    const { totalPriceAfterDiscount, totalPrice } = cart

    const cartPrice = totalPriceAfterDiscount || totalPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice

    // 3 - create order with default payment method 'cash'
    const { user, cartItems } = cart
    const order = await Order.create({
        user,
        cartItems,
        price: totalOrderPrice,
        shippingAddress: req.body.shippingAddress || req.user.addresses[0] || undefined,
    })
    // 4 - update product quantity and product sold
    if (!order) {
        return next(new ApiError('order error', 404))
    }
    const bulkOptions = cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
        }
    }))
    await Product.bulkWrite(bulkOptions, {})
    // 5 clear user cart
    await Cart.findOneAndDelete({ user: req.user._id })

    res.status(200).json({ data: order })
})
// @desc    get All orders 
// @route   GET /api/v1/orders
// @access  Private
const getAllOrders = factory.getAll(Order)


// @desc    get single order 
// @route   GET /api/v1/orders/:id
// @access  Private
const getSingleOrder = factory.getOne(Order)








module.exports = {
    createCashOrder,
    getAllOrders,
    getSingleOrder
}
