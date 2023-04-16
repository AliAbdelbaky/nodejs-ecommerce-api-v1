const mongoose = require("mongoose")
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')

const roles = ['user', 'admin', 'manager']

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    phone: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [8, ' too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerfield: Boolean,
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
    // child references (on to many)
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    addresses: [
        {
            id: { type: mongoose.Schema.Types.ObjectId },
            alias: { type: String, required: [true, 'alias is required'] },
            details: { type: String, required: [true, 'details is required'] },
            phone: { type: String, required: [true, 'phone is required'], trim: true },
            city: { type: String, required: [true, 'city is required'] },
            postalCode: { type: String, required: [true, 'postalCode is required'], trim: true }
        }
    ]
}, { timestamps: true });

const setImgURL = (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/users/${doc.image}`
        doc.image = imageURL
    }
}
userSchema.post('init', (doc) => { setImgURL(doc) })
userSchema.post('save', (doc) => { setImgURL(doc) })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    // Hashing password
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

module.exports = { User: mongoose.model("User", userSchema), roles };