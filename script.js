const cardsArray = ['🍎', '🍌', '🍇', '🍒', '🍋', '🍉', '🍍', '🥝'];
let cards = [...cardsArray, ...cardsArray]; // Duplicate cards for matching

const board = document.getElementById('game-board');
const refreshBtn = document.getElementById('refresh-btn');
const timerSpan = document.getElementById('timer');
const flipCounterSpan = document.getElementById('flip-counter');

// Sounds
const clickSound = new Audio('sounds/click.mp3');
const endSound = new Audio('sounds/end.mp3');

let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;
const totalPairs = cardsArray.length;

let timer;
let seconds = 0;
let flipCount = 0;
let hasGameStarted = false; // ✅ Flag to track game start

/* Y function cards ko har bar randomly shuffle kar dega so the game is diffrent in every time
[3, 1, 2].sort(); // Output: [1, 2, 3]
Math.random() = it gives a number between 0 or 1
but yahan per hamne 0.5 se compare kiya h to Math.random() function (-0.5 to + 0.5)
to agar y negative number generate karta h to first card second card se pehle aayga aur agar 
positive aata h to second card first se pehle aayga.
 */
function shuffleCards() { 
  cards = cards.sort(() => 0.5 - Math.random());
}

/*
setInterval(() => { ... }, 1000);
– This creates a loop that runs every 1000 milliseconds (1 second).
textContent is a property in JavaScript used to get or set the text inside an HTML element.
*/
function startTimer() {
  seconds = 0;
  timerSpan.textContent = `Time: 0s`;
  timer = setInterval(() => {
    seconds++;
    timerSpan.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function createBoard() {
  board.innerHTML = '';
  shuffleCards();
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;
  flipCount = 0;
  hasGameStarted = false; // ✅ Reset flag
  flipCounterSpan.textContent = `Flips: 0`;

  cards.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');

    /*
    card
This is the <div> HTML element you created for each card.

🔸 dataset.emoji
This means:

"Create or set the value of data-emoji attribute on the card".

So if emoji = "🍎", the line becomes:
card.dataset.emoji = "🍎";

    */
    card.dataset.emoji = emoji;
    card.innerHTML = `
      <div class="front"></div>
      <div class="back">${emoji}</div>
    `;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  refreshBtn.disabled = false;
}

function flipCard() {
  if (!hasGameStarted) {
    startTimer();         // ✅ Start timer on first click
    hasGameStarted = true;
  }

  if (lockBoard) return;
  if (this.classList.contains('flip')) return;

  this.classList.add('flip');
  flippedCards.push(this);

  clickSound.currentTime = 0;
  clickSound.play();

  flipCount++;
  flipCounterSpan.textContent = `Flips: ${flipCount}`;

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  if (isMatch) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    matchedPairs++;

    if (matchedPairs === totalPairs) {
      stopTimer();

      // Play End sound ONLY when game ends
      endSound.currentTime = 0;
      endSound.play();

      setTimeout(() => {
        alert(`🎉 Congratulations! You finished in ${seconds} seconds with ${flipCount} flips.`);
      }, 300);
    }

    flippedCards = [];
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
      lockBoard = false;
      flippedCards = [];
    }, 1000);
  }
}

/*
refreshBtn.addEventListener('click', () => { ... });
This means:

“When the refresh button is clicked, run the function inside.
So everything inside this ()=>{...} happens when you click the refresh 🔁 button
*/
refreshBtn.addEventListener('click', () => {
  stopTimer();
  timerSpan.textContent = `Time: 0s`; // Fix: Reset the timer display
  createBoard();
});

// Start the game on page load
createBoard();
