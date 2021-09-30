const { handle_server_error, buildSuccess, USER_NOT_FOUND, PASSWORD_INCORRECT } = require("../../utils/handleError");
const userModel = require('../../models/users.model')
const APIError = require('../../utils/Error.class')
const { jwtSign } = require('./auth.hooks')

const bcrypt = require('bcrypt')


exports.authenticate = async (req, res) => {
    logger.info(`Endpoint - ${req.originalUrl} [${req.method}]`)
    try {
        let { phone, password } = req.body
        let user = await userModel.findOne({ phone: phone })
        if (!user) {
            throw new APIError(USER_NOT_FOUND)
        }

        var paswordvalid = await bcrypt.compare(password, user.password);
        if (!paswordvalid) {
            throw new APIError(PASSWORD_INCORRECT)
        }
        delete user.password;

        let token = await jwtSign({ user });

        logger.info(`Endpoint - ${req.originalUrl} [${req.method}] - succefull`)
        return res.status(200).json(buildSuccess({ accessToken: token, user }))

    } catch (error) {
        let serverError = await handle_server_error(error, req);
        return res.status(serverError.code).json(serverError);
    }
}