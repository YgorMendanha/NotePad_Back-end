const mongoose = require('mongoose')
const Notas = mongoose.model('Notas',{  
    userid:{
        type:String,
    },
    titulo:{
        type:String,
        required: true
    },
    nota:{
        type:String,       
    }
})

module.exports = Notas