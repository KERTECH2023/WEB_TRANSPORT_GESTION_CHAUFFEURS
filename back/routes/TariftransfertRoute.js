const express = require('express');
const router = express.Router();
const tarifController = require('../Controllers/TariftransfertConto');

router.get('/', tarifController.getAllTarifs);


module.exports = router;
