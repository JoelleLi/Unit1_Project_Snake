// Board configuration
const width = 10
const height = 10
const cellCount = width * height
let cells = []

// Caterpillar configuration
const startingPosition = 94
let currentPosition = startingPosition
let currentDirection = "up"
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
    console.log(startingPosition)
    render()
}
}

setInterval(render, 1000)

function updateCatBody() {
    
    console.log("updateCatBody")
}

function updateFoodPosition() {
    console.log("updateFoodPosition")
}

function removeCat() {
    console.log("caterpillar removed")
    cells[currentPosition].classList.remove("cat")
}

function addCat() {
    console.log("caterpillar added to following cell => " + currentPosition)
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

    if (key === up && currentPosition >= width) {
        currentPosition -= width
        currentDirection = "up"
    } else if (key === down && currentPosition + width <= cellCount - 1) {
        currentPosition += width
        currentDirection = "down"
    } else if (key === left && currentPosition % width !== 0) {
        currentPosition--
        currentDirection = "left"
    } else if (key === right && currentPosition % width !== width - 1) {
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
    if (currentDirection === "up") {
        currentPosition = currentPosition - 10        
        addCat()
    } else if (currentDirection === "down") {
        currentPosition = currentPosition + 10
        addCat()
    } else if (currentDirection === "left") {
        currentPosition = currentPosition - 1
        addCat()
    } else if (currentDirection === "right") {
        currentPosition = currentPosition + 1
        addCat()
    } 
    console.log(currentPosition)
}

function render() {
    console.log("render")
    // updateCatDirection()
    updateCatPosition()
    // updateCatBody()
    // updateFoodPosition()
    // renderMessage()
    // renderControls()
}

function renderControls() { // if game over, disable play and renderMessage "game over"
    // display option to play again
    console.log("renderControls")
}

function renderMessage() {
   // if game over, message game over
   //if not game over, game carries on
   console.log("renderMessage")
}

// ! EVENTS
document.addEventListener("keyup", updateCatDirection)
// ! PAGE LOAD
window.addEventListener("DOMContentLoaded", init)