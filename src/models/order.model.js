
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types
let modelName = "order";

const schema = Schema({
    customerId: { type: ObjectId, ref: 'users' },
    devliveryPersonId: { type: ObjectId, ref: 'users' },
    items: [{ type: Object }],
    status: { type: String, enum: ["TASK_CREATED", "REACHED_STORE", "ITEMS_PICKED", "ENROUTE", "DELIVERED", "CANCELLED"] },
    pickupLocation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model(modelName, schema);