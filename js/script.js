// Board configuration
const width = 10
const height = 10
const cellCount = width * height
let cells = []

// Caterpillar configuration
const startingPosition = 94
let currentPosition = startingPosition
let startingFoodPosition = 0
let newFoodPosition = 0
let currentDirection = "up"
let foodPosition = 0
let catBody = [94]

function init() {
console.log("init")
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
    console.log("Grid Created")
    // Add cat class to starting position of cell
    addCat(startingPosition)
    addFood()
    console.log(startingPosition)
    render()

    }
}

setInterval(render, 400)
function render() {
    // updateFoodPosition()
    updateCatPosition()
    // updateCatBody()
    // renderMessage()
    // renderControls()
}

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
        newFoodPosition = (Math.floor((Math.random() * 99) + 1));
        cells[newFoodPosition].classList.add("food");
        foodPosition = newFoodPosition;
    // if (currentPosition === foodPosition) {
    // removeFood()
    // foodPosition = (Math.floor((Math.random() * 99) + 1))
    // cells[foodPosition].classList.add("food")
    // console.log("updateFoodPosition")
    // }
    }
}

function removeCat() {
    cells[currentPosition].classList.remove("cat")
}

function addCat() {
    cells[currentPosition].classList.add("cat")
}

function updateCatDirection(event) {
    const key = event.keyCode
    console.log(event.keyCode)

    const up = 38
    const down = 40
    const left = 37
    const right = 39

    // Remove caterpillar from previous position before updating current position to new cell
    removeCat() // Remove caterpillar BEFORE current position is updated

    if (key === up && currentDirection !== ("down" || "up")) {
        currentPosition -= width
        currentDirection = "up"
    } else if (key === down && currentDirection !== ("up" || "down")) {
        currentPosition += width
        currentDirection = "down"
    } else if (key === left && currentDirection !== ("right" || "left")) {
        currentPosition--
        currentDirection = "left"
    } else if (key === right && currentDirection !== ("left" || "right")) {
        currentPosition++
        currentDirection = "right"
    } else {
        console.log("INVALID KEY")
    }
    // Add cat class once currentPosition has been updated
    addCat(currentPosition)
    // render()
}

function updateCatPosition() {
    // needs to be current position plus one cell above
    removeCat()
    let newPosition

    if (currentDirection === "up") {
        newPosition = currentPosition - width        
    } else if (currentDirection === "down") {
        newPosition = currentPosition + width
    } else if (currentDirection === "left") {
        newPosition = currentPosition - 1
    } else if (currentDirection === "right") {
        newPosition = currentPosition + 1
    } 
    currentPosition = newPosition
    addCat()
    updateFoodPosition()

}

// function renderControls() { // if game over, disable play and renderMessage "game over"
//     // display option to play again
//     console.log("renderControls")
// }

// function renderMessage() {
//    // if game over, message game over
//    //if not game over, game carries on
//    console.log("renderMessage")
// }

// ! EVENTS
document.addEventListener("keyup", updateCatDirection)
// ! PAGE LOAD
window.addEventListener("DOMContentLoaded", init)