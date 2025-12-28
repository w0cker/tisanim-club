const mongoose = require('mongoose')           

const CursTisanSchema = new mongoose.Schema({       
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
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // אפשר להתחיל עם false ולאט לאט לעדכן
  },
 Age: {                                       
    type: String,                             
    required: [true, 'must provide text '],     
    trim: true,                                
    maxlength: [250, 'text can not be more than 250 characters'],   
  },                                             
 CursProgres: {                                  
     type: String,                             
    required: [false, 'must provide text '],                                    
    maxlength: [250, 'text can not be more than 250 characters'],   
  },
    createdAt: {                                  
   type: Date,
   default: Date.now,
  },
})

module.exports = mongoose.model('CursTisan', CursTisanSchema) 