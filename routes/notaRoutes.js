const router = require('express').Router()
const Notas = require('../models/Notas')

router.post('/', async (req, res)=>{
    const {userid, titulo, nota} = req.body    
    const notas = { 
        userid,             
        titulo,
        nota
    }
    try {
        let notes = await Notas.create(notas)         
        let id = notes._id                         
        res.status(200).json({message:"deucerto", id})  
        
    } catch (error) {
        res.json({message:"erro cap  =>"+error})
    }
})

router.put('/edit', async (req, res)=>{
    const {id, titulo, nota} = req.body        
    const notas = {        
        titulo,
        nota
    }
    try {
        await Notas.updateOne({id: id},notas)             
        res.status(201).json({mesage: "atualizadocom sucesso", id})       
    } catch (error) {
        res.json({message:error})
    }
})

router.delete('/del', async (req, res)=>{
    const {id} = req.body    
    
    try {
        await Notas.deleteOne({id: id})             
        res.status(201).json({mesage: "Apagada"})  
        
    } catch (error) {
        res.json({message:error})
    }
})
router.get('/sync/:IdUser', async (req, res)=>{  
    let IdUser = req.params.IdUser
    try{
        const notas = await Notas.find({userid: IdUser})
        res.status(200).json(notas)              
    }catch(e){
        res.status(500).json({error:e})
    }
})

router.post('/sync', async (req, res)=>{
    const {userid, titulo, nota} = req.body    
    const notas = { 
        userid,             
        titulo,
        nota
    }
    try {
        let notes = await Notas.create(notas)  
        let id = notes._id                         
        res.status(200).json({mesage: "nota  inserida", id})    
        
    } catch (error) {
        res.json({message:error})
    }
})

module.exports = router