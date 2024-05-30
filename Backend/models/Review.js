const { Schema, model, SchemaTypes } = require("mongoose");

const ReviewSchema = new Schema({
    rating: Number,
    comment: String,
    user: SchemaTypes.ObjectId,
    brewId: String,
    time: {
        type: Date,
        default: Date.now
    },
})

module.exports = model("Review", ReviewSchema)