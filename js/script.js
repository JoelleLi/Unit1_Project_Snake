function init() {
    
    let gamePaused = false

    function togglePause() {
        gamePaused = !gamePaused
        const gridMessage = document.getElementById("gridMessage")

        if (!collision && gamePaused) {
            clearInterval(gameLoop)
            console.log("game paused")
            gridMessage.innerText = "game paused"     
        } else {
            gameLoop = setInterval(render, intervalDuration)
            console.log("game unpaused")
            gridMessage.innerText = ""
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
    let gameOver = false

    // Create grid
    const grid = document.querySelector(".grid")
    function createGrid() {
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement("div")
            // cell.innerText = i
            // can also do cell.dataset.cellid = i
            cell.id = i 
            // Add the height and width to each grid cell using JS
            cell.style.height = `${100 / height}`
            cell.style.width = `${100 / width}`
            grid.appendChild(cell)
            // Add newly created div cell to cells array
            cellsIndex.push(cell)
        }
        addFood()
        render()
    }
    createGrid()

    function addCat () {
        document.querySelectorAll('.grid > div').forEach(cell => cell.classList.remove("cat", "catHead"))
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
        newIntervalDuration = Math.floor(Math.max(increasedSpeed, 50))
        console.log("speed = " + newIntervalDuration)

        intervalDuration = newIntervalDuration
        gameLoop = setInterval(render, intervalDuration)
    }

    document.addEventListener("keyup", updateCatDirection)
    function updateCatDirection(event) {
        // event.stopPropagation()        
        const key = event.keyCode
        const up = 38
        const down = 40
        const left = 37
        const right = 39
        const space = 32
    
        switch (key) {
            case up:
                if (currentDirection !== width) {
                    currentDirection = -width
                } console.log("up")
                break
            case down:
                if (currentDirection !== -width) {
                    currentDirection = width
                } console.log("down")
                break
            case left:
                if (currentDirection !== 1) {
                    currentDirection = -1
                } console.log("left")
                break
            case right:
                if (currentDirection !== -1) {
                currentDirection = 1 
                } console.log("right")
                break
            case space:
                if (event.code === "Space" && !gameOver) {
                    togglePause()
                } else {
                    updateCatDirection(event)
                }
                break
            default:
                console.log("INVALID KEY");
        }        
    }
    // function updateCatDirection(event) {
    //     const key = event.keyCode
    //     const up = 38
    //     const down = 40
    //     const left = 37
    //     const right = 39

    //      if (key === up && currentDirection !== width){
    //         currentDirection = -width
    //     } else if (key === down && currentDirection !== -width) {
    //         currentDirection = width
    //     } else if (key === left && currentDirection !== +1) {
    //         currentDirection = -1
    //     } else if (key === right && currentDirection !== -1) {
    //         currentDirection = 1
    //     } else {
    //         console.log("INVALID KEY")
    //     }
    // }

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
            (catHead + 1) % width === 0 && currentDirection === 1) {// caterpillar's head is on the right edge
                console.log("collision with walls")
                collision = true        
                collisionSound.play()
                renderMessage()
                catHead.classList.remove("catHead")
            } else {
                gameOver = false
            }
        // Check if the cat's head collides with its own body
        for (let i = 1; i < caterpillar.length; i++) {
            if (catHead === caterpillar[i] && catHead !== caterpillar[1]) {
                console.log("collision with body")
                collision = true
                collisionSound.play()
                renderMessage()
            } else {
                gameOver = false
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
            gameOver = true
            console.log("GAME OVER")
            clearInterval(gameLoop)
            const gridMessage = document.getElementById("gridMessage")
            gridMessage.innerHTML = "<h3>game over!<br>press enter<br>to play again</h3>"
            cellsIndex[caterpillar[0]].classList.remove("catHead")

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

        const gridMessage = document.getElementById("gridMessage")
        if (gridMessage) {
            gridMessage.innerText = ""
        }

        cellsIndex.forEach((cell) => cell.classList.remove("cat", "catHead", "food"))

        addCat()
        addFood()

        gameLoop = setInterval(render, intervalDuration)
    }
}
window.addEventListener("DOMContentLoaded", init)