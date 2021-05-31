const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const input = document.getElementById("input")
const btns = document.querySelectorAll(".btn")
const player = document.getElementById("player")
const validText = document.querySelector(".invalid")
const audioWin = document.getElementById("win")
const audioDraw = document.getElementById("draw")
const defaultBoardSize = 600

let step = 1
let arr = []

canvas.width = canvas.height = defaultBoardSize

for (let btn of btns) {
  btn.addEventListener("click", function () {
    if (input.value < 5 || input.value > 30) {
      validText.textContent = "Введите размер доски от 5 до 30"
      return
    }
    validText.textContent = ""
    if (setBoard) {
      clear()
    }

    setBoard()
    startGame()
  })
}
function startGame() {
  const sizeBox = defaultBoardSize / input.value
  player.textContent = step === 1 ? "Ходит игрок: Х" : "Ходит игрок: О"
  //  Координаты клика по ячейке
  canvas.onclick = function (event) {
    let x = event.offsetX
    let y = event.offsetY
    x = Math.floor(x / sizeBox)
    y = Math.floor(y / sizeBox)

    draw(sizeBox, x, y)
    checkWin(x, y)
  }
}

// Проверка на победу
function checkWin(x, y) {
  if (
    testWin(-1, 1, -1, 1, x, y) == 4 ||
    testWin(1, 1, 1, 1, x, y) == 4 ||
    testWin(0, 1, 0, 1, x, y) == 4 ||
    testWin(1, 0, 1, 0, x, y) == 4
  ) {
    showWinner(arr[y][x])
    audioWin.play()
    canvas.onclick = function (event) {
      event.stopPropagation()
    }
    return
  }

  let flag = false

  for (let i = 0; i < arr.length; i++) {
    //проверка на ничью

    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] == 0) {
        flag = true
      }
    }
  }

  if (!flag) {
    showNoWin()
    canvas.onclick = function (event) {
      event.stopPropagation()
    }
  }
}

function draw(sizeBox, x, y) {
  if (arr[y][x] == 0) {
    //отрисовка Х или 0 в зависимости от хода и заполнения массива arr

    if (step % 2 !== 0) {
      audioDraw.pause()
      audioDraw.currentTime = 0
      audioDraw.play()
      ctx.beginPath()
      ctx.strokeStyle = "#2ebf91"
      ctx.lineWidth = 3

      ctx.moveTo(
        x * sizeBox + (25 * sizeBox) / 100,
        y * sizeBox + sizeBox - (25 * sizeBox) / 100
      )
      ctx.lineTo(
        x * sizeBox + sizeBox - (25 * sizeBox) / 100,
        y * sizeBox + (25 * sizeBox) / 100
      )

      ctx.moveTo(
        x * sizeBox + sizeBox - (25 * sizeBox) / 100,
        y * sizeBox + sizeBox - (25 * sizeBox) / 100
      )
      ctx.lineTo(
        x * sizeBox + (25 * sizeBox) / 100,
        y * sizeBox + (25 * sizeBox) / 100
      )

      ctx.stroke()

      arr[y][x] = "X"
      player.textContent = "Ходит игрок: O"
    } else {
      audioDraw.pause()
      audioDraw.currentTime = 0
      audioDraw.play()
      ctx.beginPath()
      ctx.strokeStyle = "#8360c3"
      ctx.lineWidth = 3
      ctx.arc(
        x * sizeBox + sizeBox / 2,
        y * sizeBox + sizeBox / 2,
        sizeBox / 2 - (25 * sizeBox) / 100,
        0,
        Math.PI * 2
      )
      ctx.stroke()

      arr[y][x] = "O"
      player.textContent = "Ходит игрок: Х"
    }

    step++
  }
}

function clear() {
  if (!modalEl.classList.contains("hidden")) {
    modalEl.classList.add("hidden")
  }
  ctx.clearRect(0, 0, defaultBoardSize, defaultBoardSize)
  arr = []
  step = Math.random() > 0.5 ? 2 : 1
}

function setBoard() {
  const sizeBox = defaultBoardSize / input.value

  for (let i = 0; i <= defaultBoardSize; i += sizeBox) {
    //отображения поля для игры
    for (let j = 0; j <= defaultBoardSize; j += sizeBox) {
      ctx.beginPath()
      ctx.lineWidth = 3
      ctx.strokeStyle = "#000000"
      ctx.strokeRect(i, j, sizeBox, sizeBox)
      ctx.stroke()
    }
  }

  let massive = [] //заполнение двумерного массива нулями

  for (let i = 0; i < input.value; i++) {
    massive[i] = 0
  }
  for (let i = 0; i < input.value; i++) {
    arr[i] = massive.slice()
  }
}

function testWin(
  horizontalRight,
  verticalTop,
  horizontalLeft,
  verticalBottom,
  x,
  y
) {
  //проверка победил ли какой-нибудь игрок
  const winOnX = [x]
  const winOnY = [y]
  let count = 0
  let i = 1
  let j = 1

  while (count != 4) {
    if (
      arr[y + i * horizontalRight] != undefined &&
      arr[y][x] == arr[y + i * horizontalRight][x + i * verticalTop]
    ) {
      //сравнение элементов по линиям, по которым мог выиграть игрок(линии выбираются в зависимости от прееданных параметров)
      count++
      winOnX.push(x + i * horizontalRight)
      winOnY.push(y + i * verticalTop)
      i++
      continue
    } else {
      if (
        arr[y - j * horizontalLeft] != undefined &&
        arr[y][x] == arr[y - j * horizontalLeft][x - j * verticalBottom]
      ) {
        count++
        winOnX.push(x - j * horizontalLeft)
        winOnY.push(y - j * verticalBottom)
        j++
        continue
      }
    }

    return count
  }

  return count
}

// Инициализация модального окна

const modalEl = document.getElementById("modal")

function showWinner(winner) {
  let header = modalEl.getElementsByTagName("h2")[0]
  header.textContent = `🍾 Победил игрок ${winner}! 🍾`
  modalEl.classList.remove("hidden")
}

function showNoWin() {
  let header = modalEl.getElementsByTagName("h2")[0]
  header.textContent = `🍾 Ничья! 🍾`
  modalEl.classList.remove("hidden")
}
