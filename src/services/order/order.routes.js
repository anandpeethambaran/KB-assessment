const router = require('express').Router();
const { addItems, createOrder, getOrders, getSingleOrder } = require('./order.service')

router.post('/add-catelogue', addItems);
router.post('/', createOrder);
router.get('/:id', getSingleOrder);
router.get('/', getOrders);

module.exports = router;