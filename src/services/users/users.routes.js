const router = require('express').Router();
const { jwtVerification } = require('../authentication/auth.hooks');
const { createUser, getAllUsers, getUser, updateUser } = require('./users.service');

router.post('/', createUser);
router.put('/:id', jwtVerification, updateUser);
router.get('/', jwtVerification, getAllUsers);
router.get('/:id', jwtVerification, getUser);

module.exports = router;