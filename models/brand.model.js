const mongoose = require('mongoose')

const BrandScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'Category required'],
        minLength: [3, 'to short category name'],
        maxLength: [32, 'Too long category name'],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String,
        required: [true, 'Image required'],
    }
}, { timestamps: true })

const setImgURL = (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/brand/${doc.image}`
        doc.image = imageURL
    }
}
BrandScheme.post('init', (doc) => {setImgURL(doc)})
BrandScheme.post('save', (doc) => {setImgURL(doc)})

module.exports = mongoose.model('Brand', BrandScheme);