const router = require('express').Router();
const { jwtVerification, checkRole } = require('../authentication/auth.hooks');
const { addItems, createOrder, getOrders, getSingleOrder, updateOrder } = require('./order.service')

router.post('/add-catelogue', jwtVerification, checkRole(['ADMIN']), addItems);
router.post('/', jwtVerification, checkRole(['CUSTOMER']), createOrder);
router.get('/:id', jwtVerification, getSingleOrder);
router.get('/', getOrders);
router.put('/:id', updateOrder);

module.exports = router;