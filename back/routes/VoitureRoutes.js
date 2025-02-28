const express = require('express')
const  router = express.Router()


const VoitureCon  = require('../Controllers/ChauffControfrance');

const UploadImage = require ("../services/upload");


const multer = require('multer')

const Multer = multer({
  storage:multer.memoryStorage(),
  limits:1024 * 1024,
})


router.post('/addvoiture/:id',Multer.fields([
    { name: "photoCartegrise", maxCount: 1  },
    { name: "photoAssurance", maxCount: 1  },
  
  ]),UploadImage,VoitureCon.addvoiture)

  router.get('/getvoi/:id', VoitureCon.getBychauff);
  module.exports = router
