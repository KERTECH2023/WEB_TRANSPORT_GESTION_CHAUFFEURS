const express = require('express')
const  router = express.Router()


const Histo  = require('../Controllers/HistoCon')






router.post('/add',Histo.add)
router.put('/update-status/:clientId/:driveraccId', Histo.updateStatus);
router.put('/updateRe/:clientId/:driveraccId', Histo.updateRef);
router.get('/history/:driveraccId', Histo.getHistoryWithClientName);




module.exports = router