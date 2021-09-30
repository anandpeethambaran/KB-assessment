const { authenticate } = require('./authentication.service');

const router = require('express').Router();

router.post('/', authenticate);

module.exports = router;