const express = require('express');
const paymentController = require('../controller/paymentController');

const router = express.Router();

router.post('/create',paymentController.createPayment);
router.get('/all',paymentController.getAllPayment);
router.get('/:bolt11',paymentController.getPaymentStatus);

module.exports = router;