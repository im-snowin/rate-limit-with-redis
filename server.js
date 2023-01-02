const express = require('express')
const rateLimiter = require('./rate-limit')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello'})
})

app.get('/api/sendmail', rateLimiter({expiresIn: 60, allowedRequests: 10}), async(req, res) => {
    res.status(200).json({message: "Sending mail"})
})

app.listen(3000, () => console.log(`Listening at http://localhost:3000`))
