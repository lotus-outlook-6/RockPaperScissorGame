const elements = {
    userHand: document.getElementById('user-hand'),
    compHand: document.getElementById('comp-hand'),
    resultMessage: document.getElementById('result-message'),
    userScore: document.getElementById('user-score'),
    compScore: document.getElementById('comp-score'),
    options: document.querySelectorAll('.option-btn'),
    gameArea: document.querySelector('.game-area'),
    // resetBtn removed
};

// Emojis
const emojiThemes = {
    hands: {
        rock: { emoji: '🤜', beats: 'scissors' },
        paper: { emoji: '🤚', beats: 'rock' },
        scissors: { emoji: '✌️', beats: 'paper' },
        compDefault: '🤛',
        userDefault: '🤜'
    },
    objects: {
        rock: { emoji: '🪨', beats: 'scissors' },
        paper: { emoji: '📄', beats: 'rock' },
        scissors: { emoji: '✂️', beats: 'paper' },
        compDefault: '❓',
        userDefault: '❓'
    }
};

let currentTheme = 'hands';
let choices = emojiThemes[currentTheme];

let isAnimating = false;
let userScore = 0;
let compScore = 0;

// Code View Elements
const viewCodeBtn = document.getElementById('view-code-btn');
const closeBtn = document.querySelector('.close-btn');
const body = document.body;
// New Selectors for Split Layout
const codeBodyContainer = document.querySelector('.code-body-container');
const codeScrollArea = document.querySelector('.code-scroll-area');
const gutter = document.getElementById('line-numbers-gutter');
const codeBlock = document.querySelector('code');
const toggleCommentsBtn = document.getElementById('toggle-comments-btn');

// Toggle Emojis
const emojiToggle = document.getElementById('emoji-theme-toggle');
if (emojiToggle) {
    emojiToggle.addEventListener('change', (e) => {
        currentTheme = e.target.checked ? 'objects' : 'hands';
        choices = emojiThemes[currentTheme];

        // Update display if not animating
        if (!isAnimating) {
            elements.userHand.textContent = choices.userDefault;
            elements.compHand.textContent = choices.compDefault;
        }
    });
}

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

// Default to CLEAN code (false)
let isCommentsVisible = false;
let typeInterval;

function updateLineNumbers(text) {
    if (!gutter) return;
    const lineCount = text.split('\n').length;
    // Generate spans for each line number
    gutter.innerHTML = Array(lineCount).fill(0).map((_, i) => `<span>${i + 1}</span>`).join('');
}

function typeWriter(text, isReverse = false, onComplete) {
    clearInterval(typeInterval);

    if (isReverse) {
        // Fast erase animation
        const speed = 2;
        const step = 50;
        typeInterval = setInterval(() => {
            let current = codeBlock.textContent;
            if (current.length <= 0) {
                clearInterval(typeInterval);
                codeBlock.textContent = '';
                updateLineNumbers('');
                if (onComplete) onComplete();
            } else {
                codeBlock.textContent = current.substring(0, current.length - step);
            }
        }, speed);
    } else {
        // Show code with syntax highlighting
        codeBlock.style.opacity = '0';
        codeBlock.textContent = text;
        updateLineNumbers(text);

        if (window.Prism) {
            Prism.highlightElement(codeBlock);
            // Force comment visibility
            const comments = codeBlock.querySelectorAll('.token.comment');
            comments.forEach(comment => {
                comment.style.color = '#397A55';
                comment.style.opacity = '1';
                comment.style.display = 'inline';
            });
        }

        // Fade in
        setTimeout(() => {
            codeBlock.style.transition = 'opacity 0.3s ease';
            codeBlock.style.opacity = '1';
            setTimeout(() => {
                codeBlock.style.transition = '';
                if (onComplete) onComplete();
            }, 300);
        }, 50);
    }
}

// Open/Close Code View (Toggle Logic)
viewCodeBtn.addEventListener('click', () => {
    if (body.classList.contains('code-active')) {
        body.classList.remove('code-active');
        clearInterval(typeInterval);
    } else {
        body.classList.add('code-active');
        codeBlock.textContent = '';
        const initialText = isCommentsVisible ? fullSourceCode : cleanSourceCode;
        toggleCommentsBtn.textContent = isCommentsVisible ? '👁️ Hide Comments' : '👁️ Show Comments';
        typeWriter(initialText, false);
    }
});

// Close Code View
closeBtn.addEventListener('click', () => {
    body.classList.remove('code-active');
    clearInterval(typeInterval);
});

// Sync Scroll
if (codeScrollArea && gutter) {
    codeScrollArea.addEventListener('scroll', () => {
        gutter.scrollTop = codeScrollArea.scrollTop;
    });
}

// Toggle Comments Logic
toggleCommentsBtn.addEventListener('click', () => {
    const targetCode = isCommentsVisible ? cleanSourceCode : fullSourceCode;
    toggleCommentsBtn.style.pointerEvents = 'none';

    typeWriter('', true, () => {
        isCommentsVisible = !isCommentsVisible;
        toggleCommentsBtn.textContent = isCommentsVisible ? '👁️ Hide Comments' : '👁️ Show Comments';
        typeWriter(targetCode, false, () => {
            toggleCommentsBtn.style.pointerEvents = 'all';
        });
    });
});

// Copy Code Button
const copyCodeBtn = document.getElementById('copy-code-btn');
if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', async () => {
        const codeToCopy = isCommentsVisible ? fullSourceCode : cleanSourceCode;

        try {
            await navigator.clipboard.writeText(codeToCopy);
            const originalText = copyCodeBtn.textContent;
            copyCodeBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyCodeBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            copyCodeBtn.textContent = '❌ Failed';
            setTimeout(() => {
                copyCodeBtn.textContent = '📋 Copy Code';
            }, 2000);
        }
    });
}

function init() {
    elements.options.forEach(option => {
        option.addEventListener('click', () => {
            if (isAnimating) return;
            playRound(option.dataset.choice);
        });
    });

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
}

function getComputerChoice() {
    const keys = ['rock', 'paper', 'scissors'];
    // Uses keys of choices object? No, strict strings to match
    return keys[Math.floor(Math.random() * keys.length)];
}

function playRound(userChoice) {
    isAnimating = true;
    elements.userHand.textContent = choices[userChoice].emoji;

    // Always show Hand for computer during animation (Start with rock/fist)
    // regardless of theme, as requested ("shaking hand not any question mark")
    elements.compHand.textContent = '🤛';

    elements.compHand.classList.add('shaking');
    elements.resultMessage.textContent = 'Wait for it...';
    elements.resultMessage.className = '';
    elements.options.forEach(btn => btn.style.opacity = '0.5');

    setTimeout(() => {
        const compChoice = getComputerChoice();
        resolveRound(userChoice, compChoice);
    }, 500);
}

function resolveRound(userChoice, compChoice) {
    elements.compHand.classList.remove('shaking');
    // Ensure choices[compChoice] exists. 
    elements.compHand.textContent = choices[compChoice].emoji;
    let result = '';
    let resultClass = '';

    const beats = choices[userChoice].beats;
    // Check win/draw
    if (userChoice === compChoice) {
        result = 'It\'s a Draw!';
        resultClass = 'text-draw';
    } else if (beats === compChoice) {
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

    // Instantly enable buttons for next round
    isAnimating = false;
    elements.options.forEach(btn => btn.style.opacity = '1');

    // Optional: Reset message after a short delay if needed, but not blocking input
    setTimeout(() => {
        if (!isAnimating) {
            elements.resultMessage.textContent = 'Choose your weapon';
            elements.resultMessage.className = '';
        }
    }, 2000);
}

init();
