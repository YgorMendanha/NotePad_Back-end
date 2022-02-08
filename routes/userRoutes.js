const router = require('express').Router()
const Users = require('../models/Users')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/', async(req, res)=>{

    const {name, email, password, confirmpassword } = req.body  
    
    const validateEmail = /\S+@\S+\.\S+/
    const validateUser = await Users.findOne({email: email})

    let erros = []

    if(name === ""|| name === null || name.length <=2 || name === undefined){
        erros.push({error: "Digite um Nome valido"})       
        
    }
    if(validateEmail.test(email) === false){        
        erros.push({error: "Email Invalido"})        
    } 
    if(validateUser){        
        erros.push({error: "Email Indisponivel"})
    }   
    if(password.length <= 5 ){
        erros.push({error: "Senha Muito Pequena"})       
        
    }
    if(password != confirmpassword ){        
        erros.push({error: "Senhas Diferentes!"})
    }
    if(erros.length > 0){
        return res.json(erros).status(422)
    }
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    const user ={
        name,
        email,
        password:passwordHash,        
    }
    
    try{
        await Users.create(user)
        res.json({message:"Usuario Criado Com Sucesso"}).status(201)
    }catch{
        res.json({erros:"Houve um Error ao Criar Seu Usuario!"}).status(500)
    }
})

router.post('/login', async (req, res)=>{

    const {email, password} = req.body
    const user = await Users.findOne({email: email})

    if (!user) {
        return res.json("Email ou Senha Incorretos").status(404)
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.json("Email ou Senha Incorretos").status(422)
    }
    
    try {
        let name = user.name
        let email = user.email
        let id = user._id        
        let secret = process.env.SECRET
        const token = jwt.sign(
            {
              id:id
            },
        secret,)
        

        res.status(200).json({name, email ,token, id})


    } catch (error) {       
        res.status(500) 
    }


})


router.post('/restorepassword', async (req, res)=>{
    const {email} = req.body
    const user = await Users.findOne({email: email})
    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        secure: false,  
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        }})  
        var message = {
            from: "NoteApp",
            to: user.email,
            subject: "Email para Recuperar Senha do NoteApp!",
            text: "Email com o link para Recuperar Senha do NoteApp!",
            html: `<h1>Olá,${user.name}, tudo certo?</h1><p>Voce não lembra da sua senha?</p><p><br><br></p><p>Clique no Link para escolher outra!</p><p><a href="https://app-notepad.herokuapp.com/restorepassword/${user._id}">Clique Aqui!</a> <br><br><br><br><br></p><p>Até mais tarde!</p>`
          };
        transporter.sendMail(message, (e) => {
            if(e){  
                return res.json({erros:"Houve um Error ao Enviar o E-mail!"}).status(500)
            }
            return res.json({message:"E-mail enviado Com Sucesso"}).status(201)

        })           
})

router.put('/restorepassword/:IdUser', async (req, res)=>{
    try{
        let erros = []
        let IdUser = req.params.IdUser
        const {newpassword, confirmpassword} = req.body 
       
        if(newpassword != confirmpassword ){ 
                  
            erros.push({error: "Senhas Diferentes!"})
        }        
        if(newpassword.length <= 5 ){            
            erros.push({error: "Senha Muito Pequena"})
        }
        if(erros.length > 0){      
                 
            return res.json(erros).status(422)
        }
        else{ 
                      
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(newpassword, salt)
            const Password = {        
                password: passwordHash                
            }
            try {
            await Users.updateOne({id: IdUser},Password)             
            res.json({message:'Senha Atualizada!'}).status(201)       
        } catch(e){            
            res.json({message:'Houve um Error ao atualizar sua Senha!'})
        }}
    }catch{
        res.json({erros:'Houve um Error ao atualizar sua Senha!'}).status(422)       
    }
})


function checkToken (req, res, next){
    let authHeader = req.headers['authorization']   
    let token = authHeader && authHeader.split(' ')[1]     
    if(!token){
        return res.json({message:'Acesso Negado!'}).status(401)
    }
    try {
        let secret = process.env.SECRET
        jwt.verify(token, secret)        
        next()
    } catch {
        res.json({erros:"Token Invalido"}).status(400)
    }
}

router.put('/update/:IdUser', checkToken, async (req, res)=>{
    try{
        let erros = []
        let IdUser = req.params.IdUser
        const {password, newpassword, confirmpassword} = req.body     
        const user = await Users.findOne({id: IdUser})
        const checkPassword = await bcrypt.compare(password, user.password)
        if(checkPassword === false ){
            erros.push({error:'Senha Incorreta!'})
        }        
        if(newpassword != confirmpassword ){        
            erros.push({error: "Senhas Diferentes!"})
        }        
        if(newpassword.length <= 5 ){            
            erros.push({error: "Senha Muito Pequena"})
        }
        if(erros.length > 0){            
            return res.json(erros).status(422)
        }
        else{            
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(newpassword, salt)
            const Password = {        
                password: passwordHash                
            }
            try {
            await Users.updateOne({id: IdUser},Password)             
            res.json({message:'Senha Atualizada!'}).status(201)       
        } catch{
            res.json({message:'Houve um Error ao atualizar sua Senha!'})
        }}
    }catch{
        res.json({erros:'Houve um Error ao atualizar sua Senha!'}).status(422)       
    }
})


module.exports = router