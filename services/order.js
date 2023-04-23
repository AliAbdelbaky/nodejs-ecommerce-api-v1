/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET);

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


// @desc    update order paid status to true
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Admin-Manager
const updateOrderPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ApiError(`There is no order with id ${req.params.id}`, 400))
    }
    // update order to paid 
    order.isPaied = true
    order.paidAt = Date.now()

    const updatedOrder = await order.save()
    res.status(200).json({ data: updatedOrder })
})
// @desc    update order deliverd status to true
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin-Manager
const updateOrderDeliverd = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ApiError(`There is no order with id ${req.params.id}`, 400))
    }
    // update order to paid 
    order.isDelivered = true
    order.deliverdAt = Date.now()

    const updatedOrder = await order.save()
    res.status(200).json({ data: updatedOrder })
})

// @desc    Get checkout session from stipee and send it as res
// @route   PUT /api/v1/orders/checkout-session
// @access  Private/User
const checkoutSession = asyncHandler(async (req, res, next) => {
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

    const totalOrderPrice = (cartPrice + taxPrice + shippingPrice) * 100
    // 3 create stipe checkout session
    console.log(cart._id, req.get('host'), totalOrderPrice)
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // name: req.user.name,
                // amount: totalOrderPrice,
                // currency: 'egp',
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                // price: '{{PRICE_ID}}',
                quantity: 1,
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice,
                    product_data: {
                        name: req.user.name,
                        // description: 'Comfortable cotton t-shirt',
                        // images: ['https://example.com/t-shirt.png'],
                    },
                },
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id.toString(),
        metadata: req.body.shippingAddress
    })
    // 4 send session to res
    res.status(200).json({ session })
})

const webhookCheckout = asyncHandler(async (req, res, next) => {

    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log('create order here ......')
            // eslint-disable-next-line no-case-declarations
            const checkoutSessionCompleted = event.data.object;
            // Then define and call a function to handle the event checkout.session.completed
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
})





module.exports = {
    createCashOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderPaid,
    updateOrderDeliverd,
    checkoutSession,
    webhookCheckout
}
