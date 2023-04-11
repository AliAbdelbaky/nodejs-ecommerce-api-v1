const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, ' username is required'],
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
        required: [true, 'phone is required'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'image is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [8, ' too short password'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    }
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

module.exports = mongoose.model("User", userSchema);