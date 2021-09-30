const jwt = require('jsonwebtoken')
const config = require('config')

const userModel = require('../../models/users.model')
const { USER_NOT_FOUND } = require('../../utils/handleError')

exports.jwtSign = (data) => {
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

exports.jwtVerification = (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            throw new APIError(NOT_AUTHENTICATED)
        }
        const bearer = token.split(' ')
        let token = jwt.verify(bearer[1], config.JWT_SECRET);
        let userData = await userModel.findOne({ _id: token._id }).select('-password')
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