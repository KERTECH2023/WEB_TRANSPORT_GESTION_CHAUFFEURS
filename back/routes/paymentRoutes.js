const express = require('express');
const router = express.Router();
const { processPayment } = require('../Controllers/paymentController');

router.post('/payment', processPayment);

module.exports = router;
