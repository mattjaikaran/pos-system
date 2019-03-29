const app = require('express')()
const server = require('http').Server(app)
const bodyParser = require('body-parser')
const Datastore = require('nedb')

const Inventory = require('./inventory')

app.use(bodyParser.json())
module.exports = app

const Transactions = new Datastore({
  filename: '../db/transactions.db',
  autoload: true
})

app.get('/', (req, res) => {
  res.send('Transactions API')
})

// get all transactions
app.get('/all', (req, res) => {
  Transactions.find({}, (err, docs) => {
    res.send(docs)
  })
})

app.get('/limit', (req, res) => {
  const limit = parseInt(req.query.limit, 10)
  if(!limit) limit = 5
  Transactions.find({}).limit(limit).sort({ date: -1 }).exec((err, docs) => {
    res.send(docs)
  })
})

// get total sales of current day
app.get('/day-total', (req, res) => {
  if(req.query.date) {
    const startDate = new Date(req.query.date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(req.query.date)
    endDate.setHours(23,59, 59, 999)
  } else {
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
  }
  Transactions.find(
    { date: { $gte: startdate.toJSON(), $lte: endDate.toJSON()} }, 
    (err, docs) => {
      const result = { date: startDate }
      if(docs) {
        const total = docs.reduce((p, c) => {
          return p + c.total
        }, 0.00)
        result.total = parseFloat(parseFloat(total).toFixed(2))
        res.send(result)
      } else {
        result.total = 0
        res.send(result)
      }
    }
  )
})

// get transactions for specific date
app.get('/by-date', (req, res) => {
  const startDate = new Date(2018, 2, 21)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(2015, 2, 21)
  endDate.setHours(23, 59, 59, 999)
  Transactions.find(
    { date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    (err, docs) => {
      if(docs) res.send(docs)
    }
  )
})

// add new transaction
app.post('/new', (req, res) => {
  const newTransaction = req.body
  Transactions.insert(newTransaction, (err, transaction) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.sendStatus(200)
      Inventory.decrementInventory(transaction.products)
    }
  })
})

//get single transaction
app.get('/:transactionId', (req, res) => {
  Transactions.find({ _id: req.params.transactionId }, (err, doc) => {
    if(doc) res.send(doc[0])
  })
})
