const express = require('express')
require('dotenv').config({ path: './config/.env' })
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())

const dbConnection = async () => await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

dbConnection()

const Offer = mongoose.model('Offer', { offers: Array }, 'offers')

app.get('/api/v1/offers', async (req, res) => {
  try {
    const offers = await Offer.find()
    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

// Get each city count
app.get('/api/v1/offers/cities', async (req, res) => {
  try {
    const offers = await Offer.aggregate([{ $unwind: "$offers" }, {
      $group: {
        _id: "$offers.city",
        count: { $sum: 1 }
      }
    }, { $sort: { count: -1 } }])
    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
