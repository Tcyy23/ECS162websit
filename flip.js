const cardTypes = [1, 1, 1, 2, 2, 2, 3, 3, 3];
const board = document.querySelector('.board');
let gameWon = false; // Flag to track the game status

function exitGame() {
    console.log("Exiting game...");
}

function restartGame() {
    console.log("Restarting game...");
    setupBoard();
}

function shuffleCards() {
  for (let i = cardTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardTypes[i], cardTypes[j]] = [cardTypes[j], cardTypes[i]];
  }
}

function createCardElement(type) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-back"></div>
      <div class="card-front" style="background-image: url('card${type}.png');"></div>
    </div>
  `;
  card.addEventListener('click', function() {
    if (!gameWon && !this.classList.contains('flipped')) { // Prevent flipping if the card is already flipped or game is won
      this.classList.add('flipped');
      checkWin();
    }
  });
  return card;
}

function showPopup() {
  // Get the popup element
  const popup = document.getElementById("popup");

  // Make the popup visible
  popup.style.display = "block";
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

function setupBoard() {
  shuffleCards();
  board.innerHTML = '';
  cardTypes.forEach(type => {
    board.appendChild(createCardElement(type));
  });
  gameWon = false; // Reset the game won flag
}

function checkWin() {
  const flippedCards = document.querySelectorAll('.flipped');
  const cardCounts = [0, 0, 0];
  flippedCards.forEach(card => {
    const type = parseInt(card.querySelector('.card-front').style.backgroundImage.match(/(\d)\.png/)[1]) - 1;
    cardCounts[type]++;
  });

  if (cardCounts.some(count => count === 3)) {
    setTimeout(() => {
      showPopup()
      gameWon = true; // Set the game won flag to true
    }, 700); // 700ms delay, slightly longer than the flip animation
  }
}

setupBoard();