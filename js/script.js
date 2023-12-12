function init() {
    
    let gamePaused = false

    document.addEventListener("keyup", function (event) {

        if (event.code === "Space") {
            togglePause()
        } else {
            updateCatDirection(event)
        }
    })

    function togglePause() {
        gamePaused = !gamePaused
        const pauseMessage = document.getElementById("gamePaused")

        if (gamePaused) {
            clearInterval(gameLoop)
            console.log("game paused")
            pauseMessage.innerText = "game paused"     
        } else {
            gameLoop = setInterval(render, intervalDuration)
            console.log("game unpaused")
            pauseMessage.innerText = "keep munching!"
        }
    }

    // Board configuration
    const width = 20
    const height = 20
    const cellCount = width * height
    let cellsIndex = []

    const startingPosition = 242

    let currentPosition = startingPosition
    let newPosition = 0
    let startingFoodPosition = 0
    let currentScore = 0
    let currentDirection = 1
    let foodPosition = 0
    let caterpillar = [242, 241, 240]
    let collision = false

    // Create grid
    const grid = document.querySelector(".grid")
    function createGrid() {
        //Use the cellcount to create our grid cells
        for (let i = 0; i < cellCount; i++) {
            // const cell = document.getElementsByClassName("grid")
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
            // const cell = document.getElementsByClassName("grid")
        }
        // Add cat class to starting position of cell
        addFood()
        render()
    }
    createGrid()


    function addCat () {
        document.querySelectorAll('.grid > div').forEach(cell => cell.classList.remove("cat"))
        document.querySelectorAll('.grid > div').forEach(cell => cell.classList.remove("catHead")) 
        //clears the grid before moving the caterpillar
        for (let i = 0; i < caterpillar.length; i++){
            cellsIndex[caterpillar[i]].classList.add("cat")
            cellsIndex[caterpillar[0]].classList.add("catHead")
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
        // removeCat() // Remove caterpillar BEFORE current position is updated
         if (key === up && currentDirection !== width) {
            currentDirection = -width
        } else if (key === down && currentDirection !== -width) {
            currentDirection = width
        } else if (key === left && currentDirection !== +1) {
            currentDirection = -1
        } else if (key === right && currentDirection !== -1) {
            currentDirection = 1
        } else {
            console.log("INVALID KEY")
        }
    }

    function addFood() {
        startingFoodPosition = Math.floor((Math.random() * cellCount) + 1)
        
        while (caterpillar.includes(startingFoodPosition)) {
            console.log("oops, not where the caterpillar is!")
            startingFoodPosition = Math.floor((Math.random() * cellCount) + 1)
        }
        console.log("food position ok")
        cellsIndex[startingFoodPosition].classList.add("food")
        foodPosition = startingFoodPosition
    }

    function removeFood() {
        cellsIndex[foodPosition].classList.remove("food")
        let blipSound = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3')
        blipSound.play()
    }

    // setInterval(updateFoodPosition, 10)
    function updateFoodPosition() {
        if (cellsIndex[currentPosition].classList.contains("food")) {
            caterpillar.push(caterpillar.length)
            removeFood()
            addFood()
            updatePoints()
        }
    }

    function removeCat() {
        cellsIndex.forEach((cell) => cell.classList.remove("cat", "catHead"))
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
        caterpillar.pop()
        caterpillar.forEach((cell) => {
            (cellsIndex[cell].classList.add("cat"))
        }) // makes caterpillar visible
        cellsIndex[caterpillar[0]].classList.add("catHead")
    }

    function checkIfCollision() {
        const catHead = caterpillar[0]
        let collisionSound = new Audio('https://rpg.hamsterrepublic.com/wiki-images/d/d7/Oddbounce.ogg')
        // Check if caterpillar collides with walls
        if (catHead + currentDirection < 0 || // caterpillar's head is above the top boundary
            catHead + currentDirection >= cellCount || // caterpillar's head is below the bottom boundary
            catHead % width === 0 && currentDirection === -1|| // caterpillar's head is on the left edge
            (catHead + 1) % width === 0 && currentDirection === 1 || // caterpillar's head is on the right edge
            cellsIndex[catHead + currentDirection].classList.contains("cat")) {
                console.log("collision with walls")
                collision = true        
                collisionSound.play()
                renderMessage()
            }
        // Check if the cat's head collides with its own body
        for (let i = 1; i < caterpillar.length; i++) {
            if (catHead === caterpillar[i]) {

                console.log("collision with body")
                collision = true
                collisionSound.play()
                renderMessage()
            }
        }
        
    }

    let highScore = 0

    function updatePoints() {
        currentScore++
        if (currentScore > highScore) {
            highScore = currentScore
            updateHighScore()
        }
        changeGameLoop()
        document.getElementById("score").innerText = `score : ${currentScore}`
        console.log("points: " + currentScore)
    }

    function updateHighScore() {
        document.getElementById("highscore").innerText = `high score: ${highScore}`
    }

    function renderMessage() {
        if (collision === true) {
            console.log("GAME OVER")
            clearInterval(gameLoop)

            const restartMessage = document.createElement("div")
            restartMessage.classList.add("gameOver") 
            restartMessage.innerHTML = "<h2>game over!</br>press enter to play again</h2>"     
            document.body.appendChild(restartMessage)
            document.addEventListener("keyup", handleRestartOption)
            console.log("renderMessage")
        }   

    }

    function handleRestartOption(event) {
        const key = event.keyCode
        const restartKey = 13

        if (key === restartKey) {
            console.log("reset game")
            resetGame()
            document.removeEventListener("keyup", handleRestartOption)
        }
    }

    function resetGame() {
        currentPosition = startingPosition
        newPosition = 0
        startingFoodPosition = 0
        currentScore = 0
        currentDirection = 1
        foodPosition = 0
        caterpillar = [242, 241, 240]
        collision = false

        intervalDuration = startingIntervalDuration
        document.getElementById("score").innerText = `score : ${currentScore}`

        const restartMessage = document.querySelector(".gameOver")
        if (restartMessage) {
            document.body.removeChild(restartMessage)
        }

        cellsIndex.forEach((cell) => cell.classList.remove("cat", "catHead", "food"))

        addCat()
        addFood()

        gameLoop = setInterval(render, intervalDuration)
    }
}
window.addEventListener("DOMContentLoaded", init)