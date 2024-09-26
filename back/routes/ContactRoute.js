const express = require('express')
const  router = express.Router()


const Contact  = require('../Controllers/ContactCon')


router.get('/show', Contact.getAll)



 
router.post('/add',Contact.add)


// router.get('/getrec/:agent', Reclamation.getAllbyagent);
// router.get('/getrecF/:agent', Reclamation.recuprecF);
// router.put('/upRec/:id', Reclamation.updatestatus);
// router.get('/searshrec/:id', Reclamation.searchrec);




module.exports = router