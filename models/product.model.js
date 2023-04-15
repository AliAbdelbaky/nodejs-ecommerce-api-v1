const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Too short Product Title'],
        maxlength: [100, 'Too long Product Title']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Too short Product Description'],
        maxlength: [500, 'Too long Product Description']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        trim: true,
        min: [0, 'Too short Product Price']
    },
    priceDiscount: {
        type: Number,
    },
    colors: [String],
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    galary: [String],
    ratingAvarage: {
        type: Number,
        default: 0,
        min: [0, ' rating must be greater than or equal to 0'],
        max: [5, ' rating must be lower than or equal to 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    subcategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },

}, {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true }, toObject: { virtuals: true }
})

productSchema.virtual("reviews", { ref: 'Review', foreignField: 'product', localField: '_id' })

// Mongoose Query Middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name'
    })
    next()
})

const setImgURL = (doc) => {
    // return image base url + image name
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/product/${doc.image}`
        doc.image = imageURL
    }
    if (doc.galary && doc.galary.length) {
        doc.galary.forEach((item, index) => {
            const imageURL = `${process.env.BASE_URL}/product/${item}`
            doc.galary[index] = imageURL
        })
    }
}
productSchema.post('init', (doc) => { setImgURL(doc) })
productSchema.post('save', (doc) => { setImgURL(doc) })
module.exports = mongoose.model('Product', productSchema)