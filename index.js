const express = require('express')
require('dotenv').config({ path: './config/.env' })
const dbConnection = require('./config/dbConnection')

dbConnection()
const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Hello')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
