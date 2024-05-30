require('dotenv').config()
const express = require('express');
const authRouter = require('./routes/auth');
const reviewRouter = require('./routes/review');
const cors = require('cors')
require('./db')

const app = express();

app.use(express.json())
app.use(cors({
	origin: (origin, callback) => {
		if(origin===process.env.FRONTEND_ORIGIN)
			callback(null, true)
		else
			callback(new Error("Origin not allowed"))
	}, allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use('/auth', authRouter);
app.use('/review', reviewRouter);

app.listen(process.env.PORT, () => {
	console.log('process listening on port '+process.env.PORT)
})
