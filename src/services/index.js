const user = require('./users/users.routes')
const authentication = require('./authentication/authentication.routes')

module.exports = (app) => {
    app.use('/user', user)
    app.use('/authentication', authentication)
}