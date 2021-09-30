const user = require('./users/users.routes')

module.exports = (app) => {
    app.use('/user', user)
}