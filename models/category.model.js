const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
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
        const imageURL = `${process.env.BASE_URL}/category/${doc.image}`
        doc.image = imageURL
    }
}
catSchema.post('init', (doc) => {setImgURL(doc)})
catSchema.post('save', (doc) => {setImgURL(doc)})



const catModel = mongoose.model('Category', catSchema)

module.exports = catModel