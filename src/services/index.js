const user = require('./users/users.routes');
const authentication = require('./authentication/authentication.routes');
const order = require('./order/order.routes')

module.exports = (app) => {
    app.use('/user', user)
    app.use('/authentication', authentication)
    app.use('/order', order)
}