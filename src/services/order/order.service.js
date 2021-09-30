const { Types } = require('mongoose');
const logger = require('../../logger');
const itemsModel = require('../../models/items.model');
const orderModel = require('../../models/order.model');
const usersModel = require('../../models/users.model');
const APIError = require('../../utils/Error.class');
const { buildSuccess, handle_server_error, EMPTY_CART, ITEMS_NOT_FOUND, DELIVERY_PERSON_NOT_FOUND } = require('../../utils/handleError');

exports.addItems = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { name, categoryName, pickupLocations } = req.body;

        let item = await itemsModel.create({ name, categoryName, pickupLocations });

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ item }))
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.createOrder = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {

        let itemsIds;
        let { customerId, items } = req.body;

        if (items && items.length > 0) {
            itemsIds = items.map(a => a._id)
        } else {
            throw new APIError(EMPTY_CART)
        }

        let itemsData = await itemsModel.find({ $in: itemsIds })

        if (itemsData.length === 0) {
            throw new APIError(ITEMS_NOT_FOUND)
        }

        let orderData = {
            customerId,
            status: "TASK_CREATED"
        }

        orderData["items"] = []

        items.map((singleItem, index) => {
            let itemData = itemsData.find(o => o._id == singleItem._id)
            let randomPickup = itemData.pickupLocations[Math.floor(Math.random() * itemData.pickupLocations.length)];
            let obj = {
                itemId: singleItem._id,
                quantity: singleItem.quantity,
                pickupLocation: randomPickup
            }
            orderData["items"].push(obj)
        })

        let item = await orderModel.create(orderData);

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ item }))
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.updateOrder = async (req, res) => {
    try {
        let { id } = req.params

        let { deliveryPersonId, status } = req.body
        let updateData = {
            status
        }
        if (deliveryPersonId) {
            let deliveryPerson = await usersModel.findOne({ _id: deliveryPersonId });
            if (!deliveryPerson) {
                throw new APIError(DELIVERY_PERSON_NOT_FOUND)
            }
            updateData["devliveryPersonId"] = deliveryPersonId
        }

        await orderModel.updateOne({ _id: id }, updateData);
        let updateOrder = await orderModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerId"
                }
            },
            { $unwind: '$customerId' },
            {
                $project: {
                    "customerId.password": 0
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "devliveryPersonId",
                    foreignField: "_id",
                    as: "devliveryPersonId"
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "items.itemId"
                }
            },
            {
                $project: {
                    "customerId.password": 0,
                    "devliveryPersonId.password": 0,
                }
            },
            {
                $match: { _id: new Types.ObjectId(id) }
            }
        ])
        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ updateOrder }))
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.getSingleOrder = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { id } = req.params;

        let order = await orderModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerId"
                }
            },
            { $unwind: '$customerId' },
            {
                $project: {
                    "customerId.password": 0
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "devliveryPersonId",
                    foreignField: "_id",
                    as: "devliveryPersonId"
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "items.itemId"
                }
            },
            {
                $project: {
                    "customerId.password": 0,
                    "devliveryPersonId.password": 0,
                }
            },
            {
                $match: { _id: new Types.ObjectId(id) }
            }
        ])

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ order }))
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.getOrders = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { status, deliveryPersonId, customerId } = req.query
        let statusArray = [], query = {}
        if (status && typeof status !== 'object') {
            statusArray.push(status)
        } else if (status) {
            statusArray = [...status]
        }
        if (statusArray.length > 0) {
            query["status"] = { "$in": statusArray }
        }
        if (deliveryPersonId) {
            query["deliveryPersonId"] = deliveryPersonId
        }
        if (customerId) {
            query["customerId"] = customerId
        }

        let orders = await orderModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerId"
                }
            },
            { $unwind: '$customerId' },
            {
                $project: {
                    "customerId.password": 0
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "devliveryPersonId",
                    foreignField: "_id",
                    as: "devliveryPersonId"
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "items.itemId"
                }
            },
            {
                $project: {
                    "customerId.password": 0,
                    "devliveryPersonId.password": 0,
                }
            },
            {
                $match: query
            }
        ])

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ orders }))
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}