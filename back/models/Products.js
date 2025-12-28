const mongoose = require('mongoose')           

const ProductsSchema = new mongoose.Schema({       
/* name: String; completed: Boolean*/			
  name: {                                       
    type: String,                             
    required: [true, 'must provide name'],     
    trim: true,                                
    maxlength: [70, 'name can not be more than 70 characters'],   
  }, 
   specification: {                                       
    type: String,                             
    required: [true, 'must provide specification'], 
      maxlength: [250, 'info can not be more than 250 characters'],      
   
  },  
    category: {                                       
    type: String,                             
    required: [true, 'must provide category'], 
    maxlength: [20, 'info can not be more than 20 characters'],      
   
  }, 
   cost: {                                       
    type: String, 
    required: [true, 'must provide cost'],                              
     maxlength: [250, 'info can not be more than 10 characters'],                                
  },                                             
 onStock: {                                  
    type: Boolean,
    default: false,
  },
    countItems: {                                  
    type: Number,
    required: [true, 'must provide countItems'],  
  },
    createdAt: {                                  
   type: Date,
   default: Date.now
  },
})

module.exports = mongoose.model('products', ProductsSchema) 