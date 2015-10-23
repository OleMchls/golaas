var express = require('express')
var SSE = require('sse')
var EventEmitter = require('events').EventEmitter
var uuid = require('node-uuid')
var bodyParser = require('body-parser')

var app = express()
var board_exchange = new EventEmitter()
board_exchange.setMaxListeners(1024)

app.set('view engine', 'jade')

app.use('/public', express.static('public'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.text()) // for parsing application/json

app.get('/', function (req, res) {
  res.render('index', { hash: uuid.v4() })
})

app.get('/board/:id', function (req, res) {
  console.log(`client (${req.params.id}) connected`)

  var client = new SSE.Client(req, res)
  client.initialize()

  client.send('oh', 'hi')

  board_exchange.on(req.params.id, function (board) {
    client.send('board', JSON.stringify(board))
  })

  var interval = setInterval(function () {
    client.send('heartbeat', '<3')
  }, 1000)
  client.on('close', function () {
    console.log(`client (${req.params.id}) gone`)
    clearInterval(interval)
  })
})

app.get('/:id', function (req, res) {
  res.render('board', { id: req.params.id })
})

app.post('/:id', function (req, res) {
  board_exchange.emit(req.params.id, req.body)
  res.end('LONG LIFE CONWAY')
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
