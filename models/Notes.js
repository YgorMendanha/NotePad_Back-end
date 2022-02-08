const mongoose = require('mongoose')
const Notes = mongoose.model('Notes',{  
    userid:{
        type:String,
    },
    title:{
        type:String,
        required: true
    },
    note:{
        type:String,       
    }
})

module.exports = Notes