const mongoose = require('mongoose')

const notifyShema = new mongoose.Schema({
    newOrder: {
        type: Number,
        required: true
    },

    cancelOrder: {
        type: Number,
        required: true
    },

    newReview: {
        type: Number,
        required: true
    },

    slide: {
        type: Number,
        default: 1
    },

    discount: {
        type: Number,
        default: 1
    }
    
}, {
    timestamps: true
})

module.exports =  mongoose.model("Notify", notifyShema)