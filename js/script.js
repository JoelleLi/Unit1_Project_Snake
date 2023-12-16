function init() {

    /*---------- Audio ----------*/
    
    let randomFruitPosition = 0


    let isMuted = false
    let blipSound = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3")
    let collisionSound = new Audio("https://rpg.hamsterrepublic.com/wiki-images/d/d7/Oddbounce.ogg")

    const originalVolume = 1.0;
    blipSound.volume = originalVolume;
    collisionSound.volume = originalVolume;

    const muteButton = document.getElementById("muteButton")
    muteButton.addEventListener("click", toggleMute)
    muteButton.addEventListener("touchstart", toggleMute)

    function toggleMute() {
        isMuted = !isMuted
        event.preventDefault()
      
        blipSound.volume = isMuted ? 0 : originalVolume
        collisionSound.volume = isMuted ? 0 : originalVolume
      
        muteButton.innerText = isMuted ? "UNMUTE" : "MUTE"
        this.blur()
    }

    /*---------- Pause Function ----------*/

    let gamePaused = false
    let fruitAppearanceDuration = 9000
    let randomFruitTimer

    function togglePause() {
        gamePaused = !gamePaused
        const gridMessage = document.getElementById("gridMessage")
        const pauseNote = document.getElementById("pauseNote")

        if (!gameOver && gamePaused === true) {
            clearInterval(gameLoop)
            console.log("game paused")
            gridMessage.innerText = "game paused"
            pauseNote.innerHTML = "press spacebar<br>to unpause"     
            clearTimeout(randomFruitTimer);
        } else {
            gameLoop = setInterval(render, intervalDuration)
            console.log("game unpaused")
            gridMessage.innerText = ""
            pauseNote.innerHTML = "press spacebar<br>to pause"
            
            randomFruitTimer = setTimeout(() => {
                if (!randomFruit) {
                    return
                } else {
                    removeRandomFruitIfNotEaten()
            }
        }, fruitAppearanceDuration)     
        }
    }

    /*---------- Board Configuration ----------*/

    const width = 20
    const height = 20
    const cellCount = width * height
    let cellsIndex = []

    const startingPosition = 242
    let currentPosition = startingPosition
    let newPosition = 0
    let startingFoodPosition = 0
    let currentScore = 0
    let currentDirection = +1
    let foodPosition = 0
    let caterpillar = [242, 241, 240]
    let collision = false
    let highScore = 0
    let gameOver = false
    let randomFruitChoice


    const grid = document.querySelector(".grid")
    function createGrid() {
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement("div")
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
    addCat()

    function addCat () {
        document.querySelectorAll('.grid > div').forEach(cell => cell.classList.remove("cat", "catHead"))
        //clears the grid before moving the caterpillar
        for (let i = 0; i < caterpillar.length; i++){
            cellsIndex[caterpillar[i]].classList.add("cat")
            cellsIndex[caterpillar[0]].classList.add("catHead")
            }
    }

    /*---------- Game Loop & Speed ----------*/

    let startingIntervalDuration = 350
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
        newIntervalDuration = Math.floor(Math.max(increasedSpeed, 80))

        console.log("speed = " + newIntervalDuration)
        intervalDuration = newIntervalDuration
        gameLoop = setInterval(render, intervalDuration)
    }

    /*---------- Key Controls ----------*/

    const upButton = document.querySelector("#upButton")
    const downButton = document.querySelector("#downButton")
    const leftButton = document.querySelector("#leftButton")
    const rightButton = document.querySelector("#rightButton")

    upButton.addEventListener("click", () => updateCatDirection("up"))
    downButton.addEventListener("click", () => updateCatDirection("down"))
    leftButton.addEventListener("click", () => updateCatDirection("left"))
    rightButton.addEventListener("click", () => updateCatDirection("right"))

    upButton.addEventListener("touchstart", () => updateCatDirection("up"))
    downButton.addEventListener("touchstart", () => updateCatDirection("down"))
    leftButton.addEventListener("touchstart", () => updateCatDirection("left"))
    rightButton.addEventListener("touchstart", () => updateCatDirection("right"))

    document.addEventListener("keyup", updateCatDirection)

    function updateCatDirection(event) {
    let key;

    if (typeof event === 'string') {
        // If the event is a string, it means it came from the button click
        // Assign the corresponding keyCode based on the button
        switch (event) {
            case "up":
                key = 38
                break
            case "down":
                key = 40
                break
            case "left":
                key = 37
                break
            case "right":
                key = 39
                break
            default:
                console.log("INVALID BUTTON")
                return
        }
    } else {
        // If it's a keyboard event, get the keyCode
        key = event.keyCode
    }

    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32

    switch (key) {
        case up :
            if (currentDirection !== width) {
                currentDirection = -width
            }
            break
        case down:
            if (currentDirection !== -width) {
            currentDirection = width
            }
            break
        case left:
            if (currentDirection !== 1) {
            currentDirection = -1
            }
            break
        case right:
            if (currentDirection !== -1) {
            currentDirection = 1 
            }
            break
         case space:
            if (event.code === "Space" && !gameOver) {
            togglePause()
            } else {
            updateCatDirection(event)
            }
            break
            default:
            console.log("INVALID KEY")
        }        
    }

    /*---------- Food Item Events ----------*/

    // let randomFruit
    const randomFruitArray = ["blueberries", "banana", "apple", "cherries", "kiwi", "peach", "watermelon"]
    let randomFruit = false
    let isThereRandomFruit = 0
    let caterpillarLogo = document.getElementById("caterpillarLogo")

    function updateFoodPosition() {
        if (cellsIndex[currentPosition].classList.contains("food")) {
            caterpillar.push(caterpillar.length)
            fruitAppearanceDuration = Math.floor(Math.max(fruitAppearanceDuration * 0.95, 2000))
            removeFood()
            addFood()
            updatePoints()
            generateRandomFruit()
            blipSound.play()
        } else if (cellsIndex[currentPosition].classList.contains(randomFruitChoice)) {
            caterpillar.push(caterpillar.length)
            removeRandomFruit()
            updatePointsIfFruitEaten()
            blipSound.play()
        }
        return 
    }

    function addFood() {
        startingFoodPosition = Math.floor((Math.random() * cellCount))
        
        while (caterpillar.includes(startingFoodPosition) || startingFoodPosition === randomFruitPosition) {
            console.log("oops, don't put the food where the caterpillar is!")
            startingFoodPosition = Math.floor((Math.random() * cellCount))
            addFood()
        }
        cellsIndex[startingFoodPosition].classList.add("food")
        foodPosition = startingFoodPosition
    }

    function removeFood() {
        cellsIndex[foodPosition].classList.remove("food")
    }

    function generateRandomFruit() {
        isThereRandomFruit = Math.floor(Math.random() * 10)
        console.log(isThereRandomFruit)
            if (isThereRandomFruit % 1 === 0 && randomFruit === false) {
                addRandomFruit()
            } else {
                console.log("no fruit this time :(")
            }
    }

    function addRandomFruit() {
        randomFruitPosition = Math.floor(Math.random()*cellsIndex.length)
        if (caterpillar.includes(randomFruitPosition)) {
            console.log("oops, don't put the fruit where the caterpillar is!")
        } else if (randomFruitPosition === startingFoodPosition) {
            console.log("not where the food already is!")
        } else {
            randomFruitChoice = randomFruitArray[Math.floor(Math.random() * randomFruitArray.length)]
            cellsIndex[randomFruitPosition].classList.add(randomFruitChoice)
            caterpillarLogo.style.animation = "none"
            randomFruit = true
            console.log("fruit added")

            randomFruitTimer = setTimeout(() => {
                    if (!randomFruit) {
                        return
                    } else {
                        removeRandomFruitIfNotEaten()
                }
            }, fruitAppearanceDuration)
        }
    } 

    function removeRandomFruitIfNotEaten() {
        if (!randomFruit) {
            return
        }
        cellsIndex[randomFruitPosition].classList.remove(randomFruitChoice)
        console.log("removeRandomFruitIfNotEaten")
        console.log(fruitAppearanceDuration)
        clearTimeout(randomFruitTimer)
        randomFruit = false
    }

    function removeRandomFruit() {
        cellsIndex[randomFruitPosition].classList.remove(randomFruitChoice)
        clearTimeout(randomFruitTimer)
        randomFruit = false
        caterpillarLogo.style.animation = "wiggle 1s"

        console.log(fruitAppearanceDuration)
    }

    /*---------- Caterpillar Movement ----------*/

    function removeCat() {
        cellsIndex.forEach((cell) => cell.classList.remove("cat", "catHead"))
    }

    function updateCatPosition() {
        cellsIndex.forEach((cell) => cell.style.transform = "rotate(0deg)")

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
        })
        cellsIndex[caterpillar[0]].classList.add("catHead")

        rotateCatHead()
    }

    function rotateCatHead() {
        if (currentDirection === -width) { // up
            cellsIndex[caterpillar[0]].style.transform = "rotate(-180deg)";
        } else if (currentDirection === width) { // down
            cellsIndex[caterpillar[0]].style.transform = "none";
        } else if (currentDirection === 1) { // right
            cellsIndex[caterpillar[0]].style.transform = "none";
        } else if (currentDirection === -1) { // right
            cellsIndex[caterpillar[0]].style.transform = "none";
        } else {
            return
        }
    }

    function checkIfCollision() {
        const catHead = caterpillar[0]
        // Check if the cat's head collides with walls
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
            if (catHead === caterpillar[i]) {
                // && catHead !== caterpillar[1]
                console.log("collision with body")
                collision = true
                collisionSound.play()
                renderMessage()
            } else {
                gameOver = false
            }
        }
    }

    /*---------- Points System ----------*/

    function updatePointsIfFruitEaten() {
        currentScore = currentScore + 5
        if (currentScore > highScore) {
            highScore = currentScore
            updateHighScore()
        }
        document.getElementById("score").innerText = `score : ${currentScore}`
        console.log("points: " + currentScore)
    }

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

    /*---------- Game Over Events ----------*/

    function renderMessage() {
        if (collision === true) {
            gameOver = true
            console.log("GAME OVER")
            clearInterval(gameLoop)
            const gridMessage = document.getElementById("gridMessage")
            gridMessage.innerHTML = "<h3>game over!<br>press enter<br>or click here<br>to play again</h3>"
            cellsIndex[caterpillar[0]].classList.remove("catHead")

            gridMessage.addEventListener("click", handleRestartOption)
            gridMessage.addEventListener("touchstart", handleRestartOption)

            document.addEventListener("keyup", handleRestartOption)
        }   

    }

    function handleRestartOption(event) {
        const key = event.keyCode
        const restartKey = 13

        if (event.type === "click" || event.type === "touchstart" || key === restartKey) {
            resetGame()
            document.removeEventListener("keyup", handleRestartOption, ("enter"))
            const gridMessage = document.getElementById("gridMessage")
            gridMessage.removeEventListener("click", handleRestartOption)
            gridMessage.removeEventListener("touchstart", handleRestartOption)
        }
        return
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
        randomFruitPosition = 0
        randomFruit = false
        isThereRandomFruit = 0
        fruitAppearanceDuration = 9000        

        intervalDuration = startingIntervalDuration
        document.getElementById("score").innerText = `score : ${currentScore}`

        const gridMessage = document.getElementById("gridMessage")
        if (gridMessage) {
            gridMessage.innerText = ""
        }

        cellsIndex.forEach((cell) => cell.classList.remove("cat", "catHead", "food", randomFruitChoice))

        addCat()
        addFood()

        gameLoop = setInterval(render, intervalDuration)
    }
}
window.addEventListener("DOMContentLoaded", init)

// && (!gamePaused) && (gameOver === true