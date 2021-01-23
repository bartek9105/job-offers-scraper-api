const express = require('express')
require('dotenv').config({ path: './config/.env' })
const mongoose = require('mongoose')
const app = express()

const dbConnection = async () => await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

dbConnection()

const Technology = mongoose.model('Technology', { technologies: Array })

app.get('/api/v1/offers', async (req, res) => {
  try {
    const offers = await Technology.find()
    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
