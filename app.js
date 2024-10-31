let gameSeq = [];
let userSeq = [];
let started = false;
let level = 0;
let highScore = 0;

// Get the message display element and h2 element
let msg = document.querySelector("#msg");
let h2 = document.querySelector("h2");
let highScoreDisplay = document.querySelector("p");

// Get all simon buttons
let buttons = document.querySelectorAll(".simon-button");

// Create audio objects for each button
const buttonSounds = [
    new Audio('simon1.mp3'),
    new Audio('simon2.mp3'),
    new Audio('simon3.mp3'),
    new Audio('simon4.mp3')
];

// Load additional audio for play button and game over
const playButtonSound = new Audio('play button.mp3');
const gameOverSound = new Audio('game over.mp3');

// Load high score from localStorage
function loadHighScore() {
    let savedHighScore = localStorage.getItem('simonHighScore');
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore);
    }
    updateHighScoreDisplay();
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('simonHighScore', highScore.toString());
}

// Update high score display
function updateHighScoreDisplay() {
    highScoreDisplay.textContent = `Your high score is: ${highScore}`;
}

// Start game when clicking on the center circle
document.querySelector("#circ").addEventListener("click", function() {
    if (!started) {
        console.log("game started");
        started = true;
        h2.textContent = "Watch the sequence!";
        msg.innerText = "Watch";
        
        // Play the sound when the game starts
        playButtonSound.play();
        
        levelUp();
    }
});

// Function to flash button and play sound for game sequence
function gameFlash(btn) {
    btn.style.opacity = "1";
    buttonSounds[parseInt(btn.id)].play();
    setTimeout(function() {
        btn.style.opacity = "0.3";
    }, 800);
}

// Function to flash button and play sound for user clicks
function userFlash(btn) {
    btn.style.opacity = "1";
    buttonSounds[parseInt(btn.id)].play();
    setTimeout(function() {
        btn.style.opacity = "0.3";
    }, 400);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.textContent = "Watch the sequence!";
    msg.innerText = `Level ${level}`;

    // Add new random button to sequence
    let randIdx = Math.floor(Math.random() * 4);
    gameSeq.push(randIdx);
    
    // Disable buttons during sequence playback
    buttons.forEach(btn => btn.style.pointerEvents = "none");
    
    // Play the sequence after a short delay
    setTimeout(() => {
        playSequence();
    }, 600);
}

// Function to play the entire sequence
function playSequence() {
    let i = 0;
    let interval = setInterval(() => {
        gameFlash(buttons[gameSeq[i]]);
        i++;
        if (i >= gameSeq.length) {
            clearInterval(interval);
            msg.innerText = "Your Turn";
            h2.textContent = "Your turn! Repeat the sequence";
            // Enable buttons after sequence is done
            buttons.forEach(btn => btn.style.pointerEvents = "auto");
        }
    }, 800);
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            // Disable buttons during sequence playback
            buttons.forEach(btn => btn.style.pointerEvents = "none");
            setTimeout(levelUp, 800);
        }
    } else {
        msg.innerText = "Game Over!";
        h2.innerHTML = `Game Over! Your Score is ${level}<br>Click Play to restart the game`;
        
        // Play the game over sound
        gameOverSound.play();

        // Update high score if necessary
        if (level > highScore) {
            highScore = level;
            saveHighScore();
            updateHighScoreDisplay();
        }
        reset();
    }
}

function btnPress() {
    if (!started) return;
    
    let btn = this;
    let btnId = parseInt(btn.id);
    userFlash(btn);
    userSeq.push(btnId);
    checkAns(userSeq.length - 1);
}

// Add click listeners to all buttons
buttons.forEach(btn => {
    btn.addEventListener("click", btnPress);
});

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    msg.innerText = "Play";
    
    // Reset buttons
    buttons.forEach((btn, index) => {
        btn.style.pointerEvents = "none";
        btn.style.opacity = "0.3";
        
        // Reset to original colors
        switch(index) {
            case 0:
                btn.style.backgroundColor = "green";
                break;
            case 1:
                btn.style.backgroundColor = "red";
                break;
            case 2:
                btn.style.backgroundColor = "blue";
                break;
            case 3:
                btn.style.backgroundColor = "yellow";
                break;
        }
    });
}

// Initialize button states and load high score
reset();
loadHighScore();
