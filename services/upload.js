const UploadImage = (req, res, next) => {
    if (!req.files) return next();
  
    const uploadedFiles = {};
  
    Object.keys(req.files).forEach((fieldName) => {
      uploadedFiles[fieldName] = req.files[fieldName][0].buffer;
    });
  
    req.uploadedFiles = uploadedFiles;
    next();
  };
  
  module.exports = UploadImage; 