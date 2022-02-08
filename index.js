const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose')
const db = require('./config/db.js')

const app = express();
require("dotenv").config();

//Cors
app.use(cors({
    origin:['https://app-notepad.herokuapp.com']
})) 

//Conf bodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
//Mongoose
    mongoose.connect(db.mongoURI).then(() =>{
        console.log("Conectado ao Mongo!")
    }).catch((e) =>{
        console.log("Erro ao se conectar" + e)
    })

//

// Rotas   
const userRoutes = require('./routes/userRoutes')
    app.use('/user', userRoutes)
const noteRoutes = require('./routes/noteRoutes')
    app.use('/notes', noteRoutes)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
