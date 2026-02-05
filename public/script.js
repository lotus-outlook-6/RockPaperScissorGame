const elements = {
    userHand: document.getElementById('user-hand'),
    compHand: document.getElementById('comp-hand'),
    resultMessage: document.getElementById('result-message'),
    userScore: document.getElementById('user-score'),
    compScore: document.getElementById('comp-score'),
    options: document.querySelectorAll('.option-btn'),
    gameArea: document.querySelector('.game-area'),
    resetBtn: document.getElementById('reset-btn')
};

const choices = {
    rock: { emoji: '🤜', beats: 'scissors' },
    paper: { emoji: '🤚', beats: 'rock' },
    scissors: { emoji: '✌️', beats: 'paper' }
};

let isAnimating = false;
let userScore = 0;
let compScore = 0;

// Code View Elements
const viewCodeBtn = document.getElementById('view-code-btn');
const closeBtn = document.querySelector('.close-btn');
const body = document.body;
const codeContent = document.querySelector('.code-content');
const codeBlock = codeContent.querySelector('code');
const toggleCommentsBtn = document.getElementById('toggle-comments-btn');

// Full Source Code (Commented Version)
const fullSourceCode = `import random  # Importing random module to allow the computer to make a random choice

def delay():
    # List to display the Rock, Paper, Scissors countdown
    l=["Rock","Paper","Scissors"]
    
    # Printing Rock, Paper, Scissors one by one with a delay
    for i in range(3):
        print(l[i], flush=True)
        import time              # Importing time module for delay
        time.sleep(0.5)          # Half-second delay
    
    # Printing dots to simulate thinking/loading
    for i in range(3):
        print(".", end="", flush=True)
        import time              # Importing time module again for delay
        time.sleep(0.5)
    
    print()  # New line after delay animation

# Generating a random number between 1 and 3 for computer's choice
comp=random.randint(1,3)

# Taking user input for Rock, Paper, or Scissors
user=input("\\nEnter r for Rock, p for Paper, s for Scissors: ")

# Dictionary to map computer's random number to actual choice
compDict={1:"Rock",2:"Paper",3:"Scissors"}

# Dictionary to map user input to actual choice
userDict={"r":"Rock","p":"Paper","s":"Scissors"}

# Informing user that computer is choosing
print("Computer is choosing\\n", end="")

# Calling delay function for animation effect
delay()

# Displaying the choices made by computer and user
print(f"\\nComputer chose {compDict[comp]} and You chose {userDict[user]}")

# Checking for draw condition
if compDict[comp] == userDict[user]:
    print("Draw")

# Conditions where computer wins
elif (compDict[comp]=="Rock" and userDict[user]=="Scissors") or (compDict[comp]=="Paper" and userDict[user]=="Rock") or (compDict[comp]=="Scissors" and userDict[user]=="Paper"):
    print("You Lose, Computer Wins")

# Conditions where user wins
elif (compDict[comp]=="Rock" and userDict[user]=="Paper") or (compDict[comp]=="Paper" and userDict[user]=="Scissors") or (compDict[comp]=="Scissors" and userDict[user]=="Rock"):
    print("You Win, Computer Lost")

# Handling invalid input from user
else:
    print("Invalid Input")`;

// Clean Code (Uncommented Version)
const cleanSourceCode = `import random

def delay():
    l=["Rock","Paper","Scissors"]
    for i in range(3):
        print(l[i], flush=True)
        import time
        time.sleep(0.5)
    for i in range(3):
        print(".", end="", flush=True)
        import time
        time.sleep(0.5)
    print()

comp=random.randint(1,3)
user=input("\\nEnter r for Rock, p for Paper, s for Scissors: ")

compDict={1:"Rock",2:"Paper",3:"Scissors"}
userDict={"r":"Rock","p":"Paper","s":"Scissors"}

print("Computer is choosing\\n", end="")
delay()

print(f"\\nComputer chose {compDict[comp]} and You chose {userDict[user]}")

if compDict[comp] == userDict[user]:
    print("Draw")
elif (compDict[comp]=="Rock" and userDict[user]=="Scissors") or (compDict[comp]=="Paper" and userDict[user]=="Rock") or (compDict[comp]=="Scissors" and userDict[user]=="Paper"):
    print("You Lose, Computer Wins")
elif (compDict[comp]=="Rock" and userDict[user]=="Paper") or (compDict[comp]=="Paper" and userDict[user]=="Scissors") or (compDict[comp]=="Scissors" and userDict[user]=="Rock"):
    print("You Win, Computer Lost")
else:
    print("Invalid Input")`;

let isCommentsVisible = true; // Default showing full source as provided
let typeInterval;

function typeWriter(text, isReverse = false, onComplete) {
    clearInterval(typeInterval);
    const speed = isReverse ? 2 : 5; // Erase fast, type moderately
    const step = isReverse ? 50 : 5; // Erase chunks, type small chunks

    typeInterval = setInterval(() => {
        let current = codeBlock.textContent;

        if (isReverse) {
            if (current.length <= 0) {
                clearInterval(typeInterval);
                if (onComplete) onComplete();
            } else {
                codeBlock.textContent = current.substring(0, current.length - step);
            }
        } else {
            if (current.length >= text.length) {
                clearInterval(typeInterval);
                if (window.Prism) Prism.highlightElement(codeBlock);
                if (onComplete) onComplete();
            } else {
                codeBlock.textContent = text.substring(0, current.length + step);
            }
        }
    }, speed);
}

// Open Code View
viewCodeBtn.addEventListener('click', () => {
    body.classList.add('code-active');
    codeBlock.textContent = ''; // Clear start
    // Animate typing
    typeWriter(isCommentsVisible ? fullSourceCode : cleanSourceCode, false);
});

// Close Code View
closeBtn.addEventListener('click', () => {
    body.classList.remove('code-active');
    clearInterval(typeInterval);
});

// Toggle Comments Logic
toggleCommentsBtn.addEventListener('click', () => {
    // Current state is isCommentsVisible. If true, we want to go clean.
    const targetCode = isCommentsVisible ? cleanSourceCode : fullSourceCode;

    // 1. Erase current
    typeWriter('', true, () => {
        // 2. Type new
        isCommentsVisible = !isCommentsVisible;
        toggleCommentsBtn.textContent = isCommentsVisible ? '👁️ Hide Comments' : '👁️ Show Comments';
        typeWriter(targetCode, false);
    });
});

function init() {
    elements.options.forEach(option => {
        option.addEventListener('click', () => {
            if (isAnimating) return;
            playRound(option.dataset.choice);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        const key = e.key.toLowerCase();
        const validKeys = ['r', 'p', 's'];

        if (validKeys.includes(key)) {
            const btn = document.querySelector(`.option-btn[data-key="${key}"]`);
            if (btn) {
                btn.classList.add('pressed');
                setTimeout(() => btn.classList.remove('pressed'), 200);
                playRound(btn.dataset.choice);
            }
        }
    });

    elements.resetBtn.addEventListener('click', resetGame);
}

function getComputerChoice() {
    const keys = Object.keys(choices);
    return keys[Math.floor(Math.random() * keys.length)];
}

function playRound(userChoice) {
    isAnimating = true;

    // 1. Show user's choice IMMEDIATELY
    elements.userHand.textContent = choices[userChoice].emoji;

    // 2. Computer keeps thinking (shaking)
    elements.compHand.textContent = '🤛';
    elements.compHand.classList.add('shaking');

    elements.resultMessage.textContent = 'Wait for it...';
    elements.resultMessage.className = '';

    // Disable buttons
    elements.options.forEach(btn => btn.style.opacity = '0.5');

    // Wait for shake
    setTimeout(() => {
        const compChoice = getComputerChoice();
        resolveRound(userChoice, compChoice);
    }, 500);
}

function resolveRound(userChoice, compChoice) {
    elements.compHand.classList.remove('shaking');
    elements.compHand.textContent = choices[compChoice].emoji;

    let result = '';
    let resultClass = '';

    if (userChoice === compChoice) {
        result = 'It\'s a Draw!';
        resultClass = 'text-draw';
    } else if (choices[userChoice].beats === compChoice) {
        result = 'You Win!';
        resultClass = 'text-win';
        userScore++;
        elements.userScore.textContent = userScore;
    } else {
        result = 'Computer Wins!';
        resultClass = 'text-lose';
        compScore++;
        elements.compScore.textContent = compScore;
    }

    elements.resultMessage.textContent = result;
    elements.resultMessage.className = resultClass;

    // Reset UI
    setTimeout(() => {
        isAnimating = false;
        elements.options.forEach(btn => btn.style.opacity = '1');
        elements.resetBtn.classList.remove('hidden');
    }, 1000);
}

function resetGame() {
    userScore = 0;
    compScore = 0;
    elements.userScore.textContent = '0';
    elements.compScore.textContent = '0';
    elements.resultMessage.textContent = 'Choose your weapon';
    elements.resultMessage.className = '';
    elements.userHand.textContent = '🤜';
    elements.compHand.textContent = '🤛';
    elements.resetBtn.classList.add('hidden');
}

init();
