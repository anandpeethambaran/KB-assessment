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

        itemsData.map((singleItem, index) => {
            let randomPickup = singleItem.pickupLocation[Math.floor(Math.random() * array.length)];
            let { quantity } = items.find(o => o._id === singleItem._id)
            let obj = {
                itemId: singleItem._id,
                quantity,
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
        
        let updateOrder = await orderModel.updateOne({ _id: id }, updateData);
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

        let order = await orderModel.findOne({ _id: id });

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

        let { status } = req.query
        let statusArray = [], query = {}
        if (status && typeof status !== 'object') {
            statusArray.push(status)
        } else {
            statusArray = [...status]
        }
        if (statusArray.length > 0) {
            query["$in"] = statusArray
        }

        let orders = await orderModel.find(query);

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ orders }))
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}