// Board configuration
const width = 10
const height = 10
const cellCount = width * height
let cells = []

const startingPosition = 0
let currentPosition = startingPosition
let newPosition = 0
let startingFoodPosition = 0
let newFoodPosition = 0
let currentScore = 0
let currentDirection = "up"
let foodPosition = 0
let catBody = [1, 0]
let collision = false
let intervalDuration = 600
let gameState 

function init() {
// Create grid
const grid = document.querySelector(".grid")
createGrid()
function createGrid() {
    //Use the cellcount to create our grid cells
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement("div")
        // Creates 100 divs first

        // Assign index to div element 1-100
        cell.innerText = i
        // can also do cell.id = 1

        cell.id = i 

        // Add the height and width to each grid cell using JS
        cell.style.height = `${100 / height}`
        cell.style.width = `${100 / width}`

        // Add cell to grid
        grid.appendChild(cell)

        // Add newly created div cell to cells array
        cells.push(cell)
    }
    // Add cat class to starting position of cell
    addFood()
    render()
    }
}

setInterval(updateFoodPosition, 10)

setInterval(render, 600)

function render() {
    updateFoodPosition()
    updateCatPosition()
    // checkIfCollision()
    // renderMessage()

    const maxSpeed = 100
    intervalDuration = Math.max(maxSpeed, 600 - currentScore * 10)
    clearInterval(renderInterval)
    renderInterval = setInterval(render, intervalDuration)
}

let renderInterval = setInterval(render, intervalDuration)

function addFood() {
    startingFoodPosition = (Math.floor((Math.random() * 99) + 1))
    cells[startingFoodPosition].classList.add("food")
    foodPosition = startingFoodPosition
}

function removeFood() {
    cells[foodPosition].classList.remove("food")
}

function updateFoodPosition() {
    if (cells[currentPosition].classList.contains("food")) {
        removeFood()
        addFood()
        updatePoints()
        growCatBody()
    }
}

function removeCat() {
    cells.forEach((cell) => cell.classList.remove("cat"))
}

function addCat() {
    cells[currentPosition].classList.add("cat")
}

function growCatBody() {
    catBody.push(catBody.length)
    console.log("grow")
}

function updateCatDirection(event) {
    const key = event.keyCode
    const up = 38
    const down = 40
    const left = 37
    const right = 39

    // Remove caterpillar from previous position before updating current position to new cell
    removeCat() // Remove caterpillar BEFORE current position is updated

    if (key === up && currentDirection !== ("down" || "up")) {
        currentPosition -= width
        currentDirection = -width
    } else if (key === down && currentDirection !== ("up" || "down")) {
        currentPosition += width
        currentDirection = width
    } else if (key === left && currentDirection !== ("right" || "left")) {
        currentPosition--
        currentDirection = -1
    } else if (key === right && currentDirection !== ("left" || "right")) {
        currentPosition++
        currentDirection = 1
    } else {
        console.log("INVALID KEY")
    }
    // Add cat class once currentPosition has been updated
    addCat(currentPosition)    
}

function updateCatPosition() {

    if (currentDirection === -width) {
        removeCat()
        newPosition = currentPosition - width
    } else if (currentDirection === width) {
        removeCat()
        newPosition = currentPosition + width
    } else if (currentDirection === -1) {
        removeCat()
        newPosition = currentPosition - 1
    } else if (currentDirection === 1) {
        removeCat()
        newPosition = currentPosition + 1
    } 
    currentPosition = newPosition
    catBody.unshift(currentPosition)
    // console.log(catBody)
    catBody.pop()
    catBody.forEach(cell => (cells[cell].classList.add("cat"))) // makes caterpillar visible

    console.log(catBody)
}

function checkIfCollision() {
//     const catHead = catBody[0]

//     if ((catBody[0] + width >= width * width && currentDirection === width) || // hits bottom wall
//     (catBody[0] % width === width - 1 && currentDirection === 1) || // hits right wall
//     (catBody[0] % width === 0 && currentDirection === -1) || // hits left wall
//     (catBody[0] - width < 0 && currentDirection === -width)) {
//         console.log("collision with wall")
//         collision = true
//         renderMessage()
//     }
    //*-----------------------------------------------------*
    // const catHeadRow = Math.floor(catHead / width);
    // const catHeadCol = catHead % width;

    // const isOutsideLeftBoundary = catHeadCol === 0 // and render happens again
    // const isOutsideRightBoundary = catHeadCol === width - 1
    // const isOutsideTopBoundary = catHeadRow === 0
    // const isOutsideBottomBoundary = catHeadRow === Math.floor((cellCount - 1) / width)

    // if (isOutsideLeftBoundary || isOutsideRightBoundary || isOutsideTopBoundary || isOutsideBottomBoundary) {
    //     collision = true
    //     console.log("collision with wall")
    // }
    //*-----------------------------------------------------*
    // Check if the cat's head collides with its own body
    for (let i = 1; i < catBody.length; i++) {
        if (catHead === catBody[i]) {
            console.log("collision with body")
            collision = true
        }
    }
    return collision
}

function updatePoints() {
    currentScore++
    document.getElementById("score").innerText = `score : ${currentScore}`
    console.log("points: " + currentScore)
}

// function renderMessage() {
//     const collision = checkIfCollision()
//     if (collision === true) {
//         if (confirm("GAME OVER, PLAY AGAIN?")) {
//             console.log("you pressed ok")
//             location.reload()
//         } 
//     }   return
// }

// ! EVENTS
document.addEventListener("keydown", updateCatDirection)
// ! PAGE LOAD
window.addEventListener("DOMContentLoaded", init)