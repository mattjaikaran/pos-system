const express = require('express')
const http = require('http')
const app = express()
const PORT = 5000
const server = http.createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(server)
let liveCart;

console.log('POS running')
console.log('Server started')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-token, X-Key')
  if(req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.get('/', (req, res) => {
  res.send('POS web app running')
})
app.use('/api/inventory', require('./api/inventory'))
app.use('/api', require('./api/transactions'))


io.on('connection', (socket) => {
  socket.on('cart-transaction-complete', () => {
    socket.broadcast.emit('update-live-cart-display', {})
  })
  socket.on('live-cart-page-loaded', () => {
    socket.emit('update-live-cart-display', liveCart)
  })
  socket.emit('update-live-cart', (cartData) => {
    liveCart = cartData
    socket.broadcast.emit('update-live-cart-display', liveCart)
  })
})


server.listen(PORT, () => console.log(`Listening on Port ${PORT}`))
