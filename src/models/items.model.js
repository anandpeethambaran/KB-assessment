
const mongoose = require('mongoose');
const { Schema } = mongoose;
let modelName = "items";

const schema = Schema({
    name: { type: String },
    categoryName: { type: String },
    pickupLocation: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model(modelName, schema);