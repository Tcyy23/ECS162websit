const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton'); // Button to start the game
const gameOverModal = document.getElementById('gameOverModal'); // Modal for game over
const restartButton = document.getElementById('restartButton'); // Button to restart the game
const exitButton = document.getElementById('exitButton'); // Button to exit the game

document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById("gameHeader").style.display = "block";
    initGame(); 
});

document.getElementById('howToPlayButton').addEventListener('click', function() {
    document.getElementById('howToPlayModal').style.display = 'block';
});

document.getElementById('closeHowToPlay').addEventListener('click', function() {
    document.getElementById('howToPlayModal').style.display = 'none';
});



function initGame() {
    draw(); // Start the animation loop
    startButton.style.display = 'none'; // Hide start button after game starts
}

startButton.addEventListener('click', initGame);

function gameOver(won) {
    let message = won ? "Congratulations, you win!" : "Game over! Try again?";
    alert(message); 
    showGameOverModal(won);
}

function showGameOverModal(won) {
    gameOverModal.style.display = 'block'; 
    gameOverModal.textContent = won ? "You win! Play again?" : "You lost! Try again?";
}

function resetGame() {
    document.location.reload(); 
}

function exitGame() {
    window.close(); 
}

restartButton.addEventListener('click', function() {
    resetGame();
});

exitButton.addEventListener('click', function() {
    exitGame();
});



// Elements
const elements = ["Pyro", "Electro", "Cryo"];
let ballElement = elements[0];

// Ball settings
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 1
let dy = -1;

// Cannon settings
let cannonHeight = 10;
let cannonWidth = 80;
let cannonX = (canvas.width - cannonWidth) / 2;

// Bricks settings
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        let elementIndex = Math.floor(Math.random() * elements.length);
        bricks[c][r] = { x: 0, y: 0, status: 1, element: elements[elementIndex] };
    }
}


function changeBallElement() {
    let currentIndex = elements.indexOf(ballElement);
    ballElement = elements[(currentIndex + 1) % elements.length];
}

function getColorForElement(element) {
    if (element === "Pyro") return "#c1121f";
    if (element === "Electro") return "#5a189a";
    if (element === "Cryo") return "#a2d2ff";
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = getColorForElement(ballElement);
    ctx.fill();
    ctx.closePath();
}

function drawCannon() {
    ctx.beginPath();
    ctx.rect(cannonX, canvas.height-cannonHeight, cannonWidth, cannonHeight);
    ctx.fillStyle = "#fb8500";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = getColorForElement(bricks[c][r].element);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


document.addEventListener("mousemove", mouseMoveHandler, false);

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    let interaction = getInteraction(ballElement, b.element);
                    if (interaction === "none") {
                        // Only bounce back
                        dy = -dy;
                    } else {
                        switch (interaction) {
                            case "explode":
                                explodeBricks(c, r);
                                dy = -dy;  // Ball bounces back
                                break;
                            case "conduct":
                                conductBricks(c, r);
                                dy = -dy;  // Ball bounces back
                                break;
                            case "melt":
                                b.status = 0;  // Brick melts away, ball does not bounce back
                                break;
                            case "break":
                                b.status = 0;
                                dy = -dy;  // Ball bounces back
                                break;
                        }
                    }
                    return; // Exit the loop after handling the collision to prevent multiple interactions
                }
            }
        }
    }
}




function explodeBricks(centerCol, centerRow) {
    for (let c = centerCol - 1; c <= centerCol + 1; c++) {
        for (let r = centerRow - 1; r <= centerRow + 1; r++) {
            if (c >= 0 && c < brickColumnCount && r >= 0 && r < brickRowCount) {
                bricks[c][r].status = 0;
            }
        }
    }
}

function conductBricks(centerCol, centerRow) {
    // Always destroy the center brick
    if (centerCol >= 0 && centerCol < brickColumnCount && centerRow >= 0 && centerRow < brickRowCount) {
        bricks[centerCol][centerRow].status = 0;
    }

    // Create an array of potential bricks to destroy
    const potentialBricks = [];
    for (let c = centerCol - 1; c <= centerCol + 1; c++) {
        for (let r = centerRow - 1; r <= centerRow + 1; r++) {
            // Check boundaries and avoid the center brick since it's already destroyed
            if (c >= 0 && c < brickColumnCount && r >= 0 && r < brickRowCount && (c !== centerCol || r !== centerRow)) {
                potentialBricks.push({col: c, row: r});
            }
        }
    }

    // Randomly select two bricks to destroy if available
    for (let i = 0; i < 2; i++) {
        if (potentialBricks.length > 0) {
            const randomIndex = Math.floor(Math.random() * potentialBricks.length);
            const brick = potentialBricks[randomIndex];
            bricks[brick.col][brick.row].status = 0;
            potentialBricks.splice(randomIndex, 1);  // Remove the selected brick from the array to avoid picking it again
        }
    }
}

let isGameActive = false; // Flag to check if game is actively running
// Check if all bricks are cleared to determine a win
function checkForWin() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status >= 1) {
                return false;  // A brick is still intact, no win yet
            }
        }
    }
    return true;  // All bricks are cleared, win!
}

function gameOver(won) {
    isGameActive = false;  // Stop the animation loop
    let message = won ? "Congratulations, you win!" : "Game over! Try again?";
    document.getElementById('gameOverText').textContent = message;
    document.getElementById('gameOverModal').style.display = 'block';  // Show the game over modal
}


function draw() {
    if (!isGameActive) return; // Stop the drawing loop if the game is not active

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawCannon();
    collisionDetection();

    // Ball and wall collision logic
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > cannonX && x < cannonX + cannonWidth) {
            dy = -dy; // Ball hits the cannon and bounces back
        } else {
            isGameActive = false; // Stop game if ball misses the cannon
            gameOver(false); // Call gameOver function with 'false' indicating loss
        }
    }
    
    if (checkForWin()) {
        setTimeout(() => { 
            isGameActive = false;
            gameOver(true); // Player wins
            return;
        }, "500");
        
    }
    x += dx;
    y += dy;
    if (isGameActive) { // Only request another animation frame if the game is active
        requestAnimationFrame(draw);
    }
}

// Initialize the game but do not start the draw loop
function initGame() {
    isGameActive = true; // Set game to active
    draw(); // Start the animation loop
    startButton.style.display = 'none'; // Hide start button after game starts
}

function resetGame() {
    // Refresh the current page to reset the game
    window.location.reload();
}

function exitGame() {
    // Redirect to the title page
    window.location.href = 'titlepage.html';
}

startButton.addEventListener('click', initGame);

restartButton.addEventListener('click', function() {
    resetGame();
});

exitButton.addEventListener('click', function() {
    exitGame();
});


document.addEventListener("mousemove", function(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        cannonX = relativeX - cannonWidth / 2;
    }
});

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        cannonX = relativeX - cannonWidth / 2;
    }
}

function getInteraction(ballElement, brickElement) {
    if (ballElement == brickElement) return "none";
    if (ballElement == "Electro" && brickElement == "Pyro") return "explode";
    if (ballElement == "Pyro" && brickElement == "Electro") return "explode";
    if (ballElement == "Electro" && brickElement == "Cryo") return "conduct";
    if (ballElement == "Cryo" && brickElement == "Electro") return "conduct";
    if ((ballElement == "Pyro" && brickElement == "Cryo") || (ballElement == "Cryo" && brickElement == "Pyro")) return "melt";
}


document.addEventListener("mousemove", mouseMoveHandler, false);
var clickEnabled = true;

document.addEventListener("click", function() {
    if (clickEnabled) {
        // Disable further clicks
        clickEnabled = false;

        // Execute your function
        changeBallElement();

        // Set a timeout to re-enable clicks after 2 seconds
        setTimeout(function() {
            clickEnabled = true;
        }, 1500);
    }
});


requestAnimationFrame(draw);


