const mongoose = require('mongoose')           

const ContactUsSchema = new mongoose.Schema({       
/* name: String; completed: Boolean*/			
  name: {                                       
    type: String,                             
    required: [true, 'must provide name'],     
    trim: true,                                
    maxlength: [20, 'name can not be more than 20 characters'],   
  }, 
   email: {                                       
    type: String,                             
    required: [true, 'must provide email'],     
   
  },  
 Info_req: {                                       
    type: String,                             
    required: [true, 'must provide text '],     
    trim: true,                                
    maxlength: [250, 'text can not be more than 250 characters'],   
  },                                             
 Info_res: {                                  
     type: String,                             
    required: [true, 'must provide text '],     
    trim: true,                                
    maxlength: [250, 'text can not be more than 250 characters'],   
  },
    createdAt: {                                  
   type: Date,
   default: Date.now,
  },
})

module.exports = mongoose.model('ContactUs', ContactUsSchema) 