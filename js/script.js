const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score--value")
const finalscore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonplay = document.querySelector(".btn-play")

const audio = new Audio("../assets/audio.mp3")

const foodSize = 26

const size = 30

let snake =[
    { x:300, y:300 },
]

const incrementScore =() => {
    score.innerText = +score.innerText + 1
}

let direction, loopId 

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)

}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30

}


const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "green"
}

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, foodSize, foodSize)
    ctx.shadowBlur = 0

}


const drawSnake = () => {
    ctx.fillStyle = "green"
    
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }


        ctx.fillRect(position.x, position.y, size, size)
    })


}

const moveSnake = () => {
if(!direction) return   

    const head = snake[snake.length - 1]



    if (direction == "right") {
        snake.push({ x: head.x + size , y: head.y})

    }
    if (direction == "left") {
        snake.push({ x: head.x - size , y: head.y})

    }
    if (direction == "down") {
        snake.push({ x: head.x , y: head.y + size})

    }
    if (direction == "up") {
        snake.push({ x: head.x , y: head.y - size})

    }
    snake.shift()
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y 

    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]

    const neckIndex = snake.length - 2
    
    const canvasLimit = canvas.width - size

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = "flex"
    finalscore.innerText = score.innerText
    canvas.style.filter = "blur(3px)"
}

const drawGrid = () => {
    ctx.lineWidth = 0.004
    ctx.strokeStyle = "red"

    for (let i = size; i < canvas.width; i += 30 ) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
    
}


const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()
    

    loopId = setTimeout(() => {
        gameLoop()
    }, 200)
    
}
gameLoop()



document.addEventListener("keydown", ({key}) => {
    
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }
    if(key == "ArrowLeft"  && direction != "right"){
        direction = "left"
    }
    if(key == "ArrowDown"  && direction != "up"){
        direction = "down"
    }
    if(key == "ArrowUp"  && direction != "down"){
        direction = "up"
    }

})

buttonplay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake =[{ x:300, y:300 }]


})