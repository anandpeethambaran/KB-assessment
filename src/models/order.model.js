
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types
let modelName = "order";

const itemSchema = Schema({
    itemId: { type: ObjectId, required: true, ref: 'items' },
    quantity: { type: Number, required: true },
    pickupLocation: { type: String }
})

const schema = Schema({
    customerId: { type: ObjectId, ref: 'users' },
    devliveryPersonId: { type: ObjectId, ref: 'users' },
    items: [{ type: itemSchema }],
    status: { type: String, enum: ["TASK_CREATED", "ORDER_ASSIGNED", "REACHED_STORE", "ITEMS_PICKED", "ENROUTE", "DELIVERED", "CANCELLED"] }
}, { timestamps: true });

module.exports = mongoose.model(modelName, schema);