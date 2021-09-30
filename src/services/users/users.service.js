const logger = require('../../logger');
const userModel = require('../../models/users.model');
const { buildSuccess } = require('../../utils/handleError');

exports.createUser = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { email, phone, password, role } = req.body

        let salt = await bcrypt.genSalt(10);
        let hashPassord = await bcrypt.hash(password, salt);
        let user = await userModel.create({ email, phone, password: hashPassord, role });

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ user }))

    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.updateUser = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { id } = req.params

        let { email, phone, password, role } = req.body
        let user = await userModel.updateOne({ _id: id }, { email, phone, password, role });

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ user }))

    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.getUser = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { id } = req.params
        let user = await userModel.findOne({ _id: id });

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ user }))

    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.getAllUsers = async     (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {

        let users = await userModel.find();

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ users }))

    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}