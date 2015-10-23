let sse = new EventSource(`/board${window.location.pathname}`)
let draw_queue = []

sse.addEventListener('oh', function (e) {
  console.log('OH HI!')
})
sse.addEventListener('heartbeat', function (e) {
  document.getElementById('update').innerHTML = new Date()
})
sse.addEventListener('board', function (e) {
  draw_queue.push(JSON.parse(e.data))
})

requestAnimationFrame(function step () {
  let board
  if (board = draw_queue.shift()) {
    draw(board)
  }
  requestAnimationFrame(step)
})

let canvas = document.getElementById('board')
let ctx = canvas.getContext('2d')

function draw (board) {
  let board_height = board.length
  let board_width = board[0].length
  let sizeWidth = ctx.canvas.clientWidth
  let sizeHeight = ctx.canvas.clientHeight

  const DPI = Math.floor(sizeWidth / board_height)

  canvas.width = sizeWidth
  canvas.height = sizeHeight

  ctx.clearRect(0, 0, sizeWidth, sizeHeight)

  ctx.fillStyle = 'rgb(240,240,240)'
  for (var i = 0; i <= board_height; i++) {
    ctx.fillRect(0, i * DPI, board_width * DPI, 1)
    ctx.fillRect(i * DPI, 0, 1, board_width * DPI)
  }

  ctx.fillStyle = 'black'
  board.forEach(function (row, y) {
    row.forEach(function (state, x) {
      if (state) {
        ctx.fillRect(x * DPI + 1, y * DPI + 1, DPI - 1, DPI - 1)
      }
    })
  })
}
