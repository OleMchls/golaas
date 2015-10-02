var express = require('express')
var sse = require('sse-stream')
var uuid = require('node-uuid')
var app = express()

app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('index', { hash: uuid.v4() })
})

app.get('/:id', function (req, res) {
  res.render('board', { id: req.params.id })
})

var Readable = require('stream').Readable
function objectStream () {
  var stream = new Readable({ objectMode: true })
  var i = 0
  stream._read = function () {
    this.push({foo: ++i})
    if (i === 300) this.push(null)
  }
  return stream
}

app.get('/board/:id', function (req, res) {
  objectStream().pipe(sse()).pipe(res)
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
