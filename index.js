const express = require('express')
require('dotenv').config({ path: './config/.env' })
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())

const dbConnection = async () =>
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })

dbConnection()

const Offer = mongoose.model('Offer', { offers: Array }, 'offers')

app.get('/api/v1/offers', async (req, res) => {
  try {
    const offers = await Offer.find().limit(1).sort({ $natural: -1 })
    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

// Get each city count
app.get('/api/v1/offers/cities', async (req, res) => {
  try {
    const offers = await Offer.aggregate([
      {
        $limit: 1
      },
      {
        $sort: { natural: -1 }
      },
      { $unwind: '$offers' },
      {
        $group: {
          _id: '$offers.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).limit(20)

    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

// Get each technology count
app.get('/api/v1/offers/technologies', async (req, res) => {
  try {
    const offers = await Offer.aggregate([
      {
        $limit: 1
      },
      {
        $sort: { natural: -1 }
      },
      { $unwind: '$offers' },
      { $unwind: '$offers.technologies' },
      {
        $group: {
          _id: '$offers.technologies',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

app.get('/api/v1/offers/cities/technologies', async (req, res) => {
  try {
    const offers = await Offer.aggregate([
      {
        $limit: 1
      },
      {
        $sort: { natural: -1 }
      },
      { $unwind: '$offers' },
      { $unwind: '$offers.technologies' },
      {
        $group: {
          _id: {
            id: "$offers.city",
            technologies: '$offers.technologies'
          },
          count: { $sum: 1 }
        },
      },
      {
        $group: {
          _id: '$_id.id',
          technologies: {
            $push: {
              name: '$_id.technologies',
              count: '$count'
            }
          }
        }
      }
    ])
    res.status(200).send(offers)
  } catch (error) {
    console.error(error)
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
