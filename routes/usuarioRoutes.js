const router = require('express').Router()
const Usuario = require('../models/Usuarios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/', async(req, res)=>{

    const {nome, email, senha } = req.body

    if(!nome){
        res.status(422).json({error: "O nome é obrigatorio"})
        return
    }
    if(!email){
        res.status(422).json({error: "O email é obrigatorio"})
        return
    }
    if(!senha){
        res.status(422).json({error: "A senha é obrigatoria"})
        return
    }
    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt)
    const usuario ={
        nome,
        email,
        senha:senhaHash,
    }
    
    try{
        await Usuario.create(usuario)
        res.status(201)
    }catch{
        res.status(500)
    }
})

router.post('/login', async (req, res)=>{

    const {email, senha} = req.body

    const user = await Usuario.findOne({email: email})

    if (!user) {
        return res.status(404)
    }

    const checkPassword = await bcrypt.compare(senha, user.senha)

    if (!checkPassword) {
        return res.status(422)
    }
    
    try {
        let nome = user.nome
        let email = user.email
        let id = user._id        
        let secret = process.env.SECRET
        const token = jwt.sign(
            {
              id:id
            },
        secret,)
        

        res.status(200).json({nome, email ,token, id})


    } catch (error) {       
        res.status(500) 
    }


})

module.exports = router