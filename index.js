// imports
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const schema = require('./schema/schema')
const cors = require('cors')
require('dotenv/config')

// setup
const PORT = process.env.PORT || 5000

const app = express()
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`server listening to ${PORT}`)))
    .catch(err => console.log('connection error'))
app.use(express.json())
app.use(cors())

// routes
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))