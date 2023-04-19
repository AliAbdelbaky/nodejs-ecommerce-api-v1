const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/apiError')

const calculateTotalPrice = (cart) => {
    let totalPrice = 0
    cart.cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity
    })
    cart.totalPrice = totalPrice
}
// @desc    add product to cart
// @route   POST  /api/v1/cart
// @access  Private/user
const addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body
    const product = await Product.findById(productId)
    // 1 get cart of logged user
    let cart = await Cart.findOne({ user: req.user._id })

    const cartItemPayload = { product: productId, color, price: product.price }


    if (!cart) {
        // create new cart for user with products
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [cartItemPayload]
        })

    } else {
        // if product is already exist ?
        const productIndex = cart.cartItems.findIndex(item => item.product.toString() === productId && item.color === color);
        if (productIndex > -1) {
            // if true update product quantity 
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
        } else {
            // push product to cart items
            cart.cartItems.push(cartItemPayload);
        }
    }
    // Calculate Total cart price
    calculateTotalPrice(cart)
    await cart.save();
    res.status(200).json({
        data: cart,
        message: 'Product added successfully to cart',
    })
})

// @desc    get logged user's cart
// @route   GET  /api/v1/cart
// @access  Private/user
const getUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        return next(new ApiError(`There is no cart with id ${req.user._id}`, 404))
    }
    res.status(200).json({ data: cart, lenght: cart.cartItems.length })
})

// @desc    remove spacific cart item
// @route   DELETE  /api/v1/cart/:id
// @access  Private/user
const removeCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.id } }
        },
        { new: true }
    )
    calculateTotalPrice(cart)
    await cart.save()
    res.status(200).json({
        data: cart,
        message: 'Product added removed',
    })
})

// @desc    remove  cart 
// @route   DELETE  /api/v1/cart
// @access  Private/user
const removeCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id })
    res.status(200).json({ msg: 'cart deleted successfully' })
})

// @desc    update spacific product cart item
// @route   PUT  /api/v1/cart/:id
// @access  Private/user
const updateProductQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        return next(new ApiError('There is no cart this user', 404))
    }
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.id)
    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex]
        cartItem.quantity = quantity
        cart.cartItems[itemIndex] = cartItem
        calculateTotalPrice(cart)
    } else {
        return next(new ApiError(`There is no item for this id ${req.params.id}`, 404))
    }
    await cart.save()
    res.status(200).json({msg:'cart updated successfully'})
})
module.exports = {
    addProductToCart,
    getUserCart,
    removeCartItem,
    removeCart,
    updateProductQuantity
}