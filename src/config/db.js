if (process.env.NODE_ENV === 'production') {
	module.exports = { mongoURI: process.env.MONGO_URL }
} else {
	module.exports = { mongoURI: 'mongodb://localhost/bloco-de-notas' }
}
