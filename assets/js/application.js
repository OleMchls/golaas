let foo = 'bar'
console.log(`string ${foo}`)

let sse = new EventSource(`/board${window.location.pathname}`)

sse.addEventListener('oh', function (e) {
  console.log('OH HI!')
})
sse.addEventListener('heartbeat', function (e) {
  document.getElementById('update').innerHTML = new Date()
})
sse.addEventListener('board', function (e) {
  draw(JSON.parse(e.data))
})

let board = document.getElementById('board')
let ctx = board.getContext('2d')

function draw (board) {
  const DPI = 5
  const RECT_WIDTH = 4
  const RECT_HEIGHT = 4
  // console.log(board)
  let sizeWidth = ctx.canvas.clientWidth
  let sizeHeight = ctx.canvas.clientHeight
  ctx.clearRect(0, 0, sizeWidth, sizeHeight)
  board.forEach(function (row, y) {
    row.forEach(function (state, x) {
      if (state) {
        ctx.fillRect(x * DPI, y * DPI, RECT_WIDTH, RECT_HEIGHT)
      }
    })
  })
}
