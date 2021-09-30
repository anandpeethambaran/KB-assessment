
const mongoose = require('mongoose');
const { Schema } = mongoose;
let modelName = "users";

const schema = Schema({
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    role: { type: String, enum: ["ADMIN", "CUSTOMER", "DELIVERY_PERSON"] }
}, { timestamps: true });

module.exports = mongoose.model(modelName, schema);