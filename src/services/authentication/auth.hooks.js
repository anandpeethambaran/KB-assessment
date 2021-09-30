const jwt = require('jsonwebtoken')
const config = require('config')

const userModel = require('../../models/users.model')
const { USER_NOT_FOUND, NOT_AUTHENTICATED, handle_server_error, UNAUTHORIZED } = require('../../utils/handleError')
const APIError = require('../../utils/Error.class')

exports.jwtSign = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { user } = data
            let token = jwt.sign({ user }, config.JWT_SECRET, { expiresIn: '1d' })
            return resolve(token)
        } catch (error) {
            reject(error)
        }
    })
}

exports.jwtVerification = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            throw new APIError(NOT_AUTHENTICATED)
        }
        const bearer = token.split(' ')
        let user = jwt.verify(bearer[1], config.JWT_SECRET);
        let userData = await userModel.findOne({ _id: user._id }).select('-password')
        if (!userData) {
            throw new APIError(USER_NOT_FOUND)
        }
        req.user = userData;
        next();
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}

exports.checkRole = (role) => async (req, res, next) => {
    try {
        let user = req.user;
        if (!role.includes(user.role)) {
            throw new APIError(UNAUTHORIZED)
        }
        next();
    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}