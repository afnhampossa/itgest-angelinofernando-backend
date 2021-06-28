const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')

const users = require('./users')

const PORT = 3000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mozeco_pdv',
})

connection.connect((error) => {
  if (error) {
    throw error
  }

  users(app, connection)

  app.get('/welcome', (req, res) => {
    const { name } = req.query

    res.send(`Welcome ${name} :)`)
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})
