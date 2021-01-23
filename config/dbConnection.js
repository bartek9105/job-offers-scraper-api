const MongoClient = require('mongodb').MongoClient

const dbConnection = async () => {
  try {
    await MongoClient.connect(process.env.MONGO_URL, (err, client) => {
      console.log('Connected to MongoDB')
      client.close()
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = dbConnection