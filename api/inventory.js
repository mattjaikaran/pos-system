const app = require('express')()
const server = require('http').Server(app)
const bodyParser = require('body-parser')
const Datastore = require('nedb')
const async = require('async')

app.use(bodyParser.json())

module.exports = app

const inventoryDB = new Datastore({
  filename: '../db/inventory.db',
  autoload: true
})

app.get('/', (req, res) => {
  res.send('Inventory API')
})

//get by id
app.get('/product/:productId', (req, res) => {
  if(!req.params.productId) {
    res.status(500).send('ID field is required')
  } else {
    inventoryDB.findOne({ _id: req.params.productId }, (err, product) => {
      res.send(product)
    })
  }
})

// get all
app.get('/products', (req, res) => {
  inventoryDB.find({}, (err, docs) => {
    console.log('sending inventory products')
    res.send(docs)
  })
})

// create
app.post('/product', (req, res) => {
  const newProduct = req.body
  inventoryDB.insert(newProduct, (err, product) => {
    if (err) res.status(500).send(err)
    else res.send(product)
  })
})

// delete
app.delete('/product/:productId', (req, res) => {
  inventoryDB.remove({ _id: req.params.productId }, (err, numRemoved) => {
    if(err) res.status(500).send(err)
    else res.sendStatus(200)
  })
})

// update
app.put('/product', (req, res) => {
  const productId = req.body._id

  inventoryDB.update({ _id: productId }, req.body, {}, (err, numReplaced, product) => {
      if (err) res.status(500).send(err)
      else res.sendStatus(200)
    }
  )
})

app.decrementInventory = (products) => {
  async.eachSeries(products, (transactionProduct, callback) => {
    inventoryDB.findOne({ _id: transactionProduct._id }, (err, product) => {
      if(!product || !product.quantity_on_hand) {
        callback()
      } else {
        const updatedQuantity = parseInt(product.quantity_on_hand) - parseInt(transactionProduct.quantity)
        inventoryDB.update(
          { _id: product._id },
          { $set: { quantity_on_hand: updatedQuantity } },
          {},
          callback
        )
      }
    })
  })
}
