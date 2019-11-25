const express = require('express');
const invoiceController = require('../controller/invoiceController');

const router = express.Router();

router.post('/create',invoiceController.createInvoice);
router.get('/all',invoiceController.getAllInvoice);
router.post('/decodeinvoice',invoiceController.decodeInvoice);
router.get('/:label',invoiceController.getInvoiceStatus);
router.delete('/invoice/:label',invoiceController.deleteInvoice);
router.delete('/all',invoiceController.deleteAllInvoices)

module.exports = router;