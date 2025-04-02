const express = require('express')
const  router = express.Router()


const Transfert  = require('../Controllers/TransfertContro');






router.post('/add',Transfert.createTransfer);
router.post('/payement',Transfert.createCheckoutSession);





module.exports = router
