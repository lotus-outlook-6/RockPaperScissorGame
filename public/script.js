const elements = {
    userScore: document.getElementById('user-score'),
    compScore: document.getElementById('comp-score'),
    userHand: document.getElementById('user-hand'),
    compHand: document.getElementById('comp-hand'),
    resultMessage: document.getElementById('result-message'),
    options: document.querySelectorAll('.option-btn'),
    gameArea: document.querySelector('.game-area'),
    resetBtn: document.getElementById('reset-btn')
};

const choices = {
    rock: { emoji: '🪨', beats: 'scissors' },
    paper: { emoji: '📄', beats: 'rock' },
    scissors: { emoji: '✂️', beats: 'paper' }
};

let scores = {
    user: 0,
    comp: 0
};

let isAnimating = false;

function init() {
    elements.options.forEach(option => {
        option.addEventListener('click', () => {
            if (isAnimating) return;
            playRound(option.dataset.choice);
        });
    });

    elements.resetBtn.addEventListener('click', resetGame);
}

function playRound(userChoice) {
    isAnimating = true;

    // 1. Show user's choice IMMEDIATELY
    elements.userHand.textContent = choices[userChoice].emoji;

    // 2. Computer keeps thinking (shaking)
    elements.compHand.textContent = '🤛'; // Ensure it's the rock/fist
    elements.compHand.classList.add('shaking'); // Only shake computer

    elements.resultMessage.textContent = 'Wait for it...';
    elements.resultMessage.className = '';

    // Disable buttons
    elements.options.forEach(btn => btn.style.opacity = '0.5');

    // Wait for shake to finish (1.5s)
    setTimeout(() => {
        const compChoice = getComputerChoice();
        resolveRound(userChoice, compChoice);
    }, 1500);
}

function getComputerChoice() {
    const keys = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
}

function resolveRound(userChoice, compChoice) {
    // Stop shaking
    elements.compHand.classList.remove('shaking');

    // Reveal computer hand
    elements.userHand.textContent = choices[userChoice].emoji;
    elements.compHand.textContent = choices[compChoice].emoji;

    // Logic
    if (userChoice === compChoice) {
        elements.resultMessage.textContent = 'It\'s a Draw!';
        elements.resultMessage.classList.add('text-draw');
    } else if (choices[userChoice].beats === compChoice) {
        elements.resultMessage.textContent = 'You Win!';
        elements.resultMessage.classList.add('text-win');
        scores.user++;
    } else {
        elements.resultMessage.textContent = 'Computer Wins!';
        elements.resultMessage.classList.add('text-lose');
        scores.comp++;
    }

    // Update scoreboard
    updateScoreboard();

    // Re-enable buttons
    elements.options.forEach(btn => btn.style.opacity = '1');
    isAnimating = false;
}

function updateScoreboard() {
    // Pulse animation for number change could be added here
    elements.userScore.textContent = scores.user;
    elements.compScore.textContent = scores.comp;
}

function resetGame() {
    scores = { user: 0, comp: 0 };
    updateScoreboard();
    elements.resultMessage.textContent = 'Choose your weapon';
    elements.resultMessage.className = '';
    elements.userHand.textContent = '🤜';
    elements.compHand.textContent = '🤛';
}

init();
