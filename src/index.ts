import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.get('/', (req, res) => {
  res.send('Hello RENEC!')
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
})
