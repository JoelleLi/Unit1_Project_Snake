function init() {

    // Board configuration
    const width = 20
    const height = 20
    const cellCount = width * height
    let cellsIndex = []

    const startingPosition = 54

    let currentPosition = startingPosition
    let newPosition = 0
    let startingFoodPosition = 0
    let currentScore = 0
    let currentDirection = 1
    let foodPosition = 0
    let caterpillar = [54, 53, 52]
    let collision = false

    // Create grid
    const grid = document.querySelector(".grid")
    function createGrid() {
        //Use the cellcount to create our grid cells
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement("div")
            // Creates 100 divs first

            // Assign index to div element 1-100
            // cell.innerText = i

            // can also do cell.dataset.cellid = i
            cell.id = i 

            // Add the height and width to each grid cell using JS
            cell.style.height = `${100 / height}`
            cell.style.width = `${100 / width}`

            // Add cell to grid
            grid.appendChild(cell)

            // Add newly created div cell to cells array
            cellsIndex.push(cell)
        }
        // Add cat class to starting position of cell
        addFood()
        render()
    }
    createGrid()

    function addCat () {
        document.querySelectorAll('.grid > div').forEach(cell => cell.classList.remove("cat")) 
        //clears the grid before moving the caterpillar
        for (let i = 0; i < caterpillar.length; i++){
            cellsIndex[caterpillar[i]].classList.add("cat")
            }
    }
    // put caterpillar in starting position on board
    addCat()

    let startingIntervalDuration = 400
    const reduceIntervalDuration = 0.95
    let intervalDuration = startingIntervalDuration
    let newIntervalDuration = 0

    let gameLoop = setInterval(render, intervalDuration)

    function render(){
        checkIfCollision()
        updateCatPosition()
        updateFoodPosition()      
    }

    function changeGameLoop(){
        clearInterval(gameLoop)
        const increasedSpeed = intervalDuration * reduceIntervalDuration
        newIntervalDuration = Math.max(increasedSpeed, 50)
        console.log("speed = " + newIntervalDuration)

        intervalDuration = newIntervalDuration
        gameLoop = setInterval(render, intervalDuration)
    }

    document.addEventListener("keydown", updateCatDirection)

    function updateCatDirection(event) {
        const key = event.keyCode
        const up = 38
        const down = 40
        const left = 37
        const right = 39
        // Remove caterpillar from previous position before updating current position to new cell
        // removeCat() // Remove caterpillar BEFORE current position is updated

        if (key === up && currentDirection !== width) {
            // currentPosition -= width
            currentDirection = -width
        } else if (key === down && currentDirection !== -width) {
            // currentPosition += width
            currentDirection = width
        } else if (key === left && currentDirection !== +1) {
            // currentPosition--
            currentDirection = -1
        } else if (key === right && currentDirection !== -1) {
            // currentPosition++
            currentDirection = 1
        } else {
            console.log("INVALID KEY")
        }
        // Add cat class once currentPosition has been updated
        // addCat()    
    }

    function addFood() {
        startingFoodPosition = (Math.floor((Math.random() * 99) + 1))
        cellsIndex[startingFoodPosition].classList.add("food")
        foodPosition = startingFoodPosition
    }

    function removeFood() {
        cellsIndex[foodPosition].classList.remove("food")
    }

    // setInterval(updateFoodPosition, 10)
    function updateFoodPosition() {
        if (cellsIndex[currentPosition].classList.contains("food")) {
            caterpillar.push(caterpillar.length)
            console.log("grow")
            removeFood()
            addFood()
            updatePoints()
        }
    }

    function removeCat() {
        cellsIndex.forEach((cell) => cell.classList.remove("cat"))
    }

    function updateCatPosition() {

        if (currentDirection === -width) { // up
            removeCat()
            newPosition = currentPosition - width
        } else if (currentDirection === width) { // down
            removeCat()
            newPosition = currentPosition + width
        } else if (currentDirection === -1) { // left
            removeCat()
            newPosition = currentPosition - 1
        } else if (currentDirection === +1) { // right
            removeCat()
            newPosition = currentPosition + 1
        } 
        currentPosition = newPosition
        caterpillar.unshift(currentPosition)
        // console.log(catBody)
        caterpillar.pop()
        caterpillar.forEach(cell => (cellsIndex[cell].classList.add("cat"))) // makes caterpillar visible
        console.log(caterpillar)

    }

    function checkIfCollision() {
        const catHead = caterpillar[0]
        console.log("checking for collision")
        // Check if caterpillar collides with walls
        if (catHead + currentDirection < 0 || // caterpillar's head is above the top boundary
            catHead + currentDirection >= cellCount || // caterpillar's head is below the bottom boundary
            catHead % width === 0 && currentDirection === -1|| // caterpillar's head is on the left edge
            (catHead + 1) % width === 0 && currentDirection === 1 || // caterpillar's head is on the right edge
            cellsIndex[catHead + currentDirection].classList.contains("cat")) {
                console.log("collision with walls")
                collision = true
                renderMessage()
                console.log(catHead)
            }
        // Check if the cat's head collides with its own body
        for (let i = 1; i < caterpillar.length; i++) {
            if (catHead === caterpillar[i]) {
                console.log("collision with body")
                collision = true
                renderMessage()
            }
        }
    }

    function updatePoints() {
        currentScore++
        changeGameLoop()
        document.getElementById("score").innerText = `score : ${currentScore}`
        console.log("points: " + currentScore)
    }

    function renderMessage() {
        if (collision === true) {
            console.log("GAME OVER")
            clearInterval(gameLoop)
            return
        
        }   
    }
}
window.addEventListener("DOMContentLoaded", init)