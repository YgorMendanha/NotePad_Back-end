const router = require('express').Router()
const Notes = require('../models/Notes')

router.post('/', async (req, res) => {
	const { userid, title, note } = req.body
	const notes = {
		userid,
		title,
		note,
	}
	try {
		const note = await Notes.create(notes)
		const _id = note._id
		res.status(200).json({ message: 'Nota Salva com Sucesso!', _id })
	} catch {
		res.json({ error: 'Houve um Error ao Salvar a Nota' })
	}
})

router.put('/edit', async (req, res) => {
	try {
		const { id, title, note } = req.body
		const notes = {
			title,
			note,
		}
		await Notes.updateOne({ _id: id }, notes)
		res.json({ message: 'Nota Editada com Sucesso!' }).status(201)
	} catch {
		res.json({ error: 'Houve um Error ao Editar a Nota!' })
	}
})

router.delete('/del/:_id', async (req, res) => {
	try {
		const id = req.params
		await Notes.deleteOne({ _id: id })
		res.json({ message: 'Nota Apagada com Sucesso!' }).status(201)
	} catch (error) {
		res.json({ error: error })
	}
})

router.get('/sync/:IdUser', async (req, res) => {
	const IdUser = req.params.IdUser
	try {
		const notes = await Notes.find({ userid: IdUser })
		res.status(200).json(notes)
	} catch (e) {
		res.status(500).json({ error: e })
	}
})

router.post('/sync', async (req, res) => {
	const { userid, title, note } = req.body
	const notes = {
		userid,
		title,
		note,
	}
	try {
		const note = await Notes.create(notes)
		const id = note._id
		res.status(200).json({ mesage: 'nota  inserida', id })
	} catch (error) {
		res.json({ error: error })
	}
})

module.exports = router
