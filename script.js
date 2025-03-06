// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCM1rMjhdJAilpz6MMfE2-eaT6gG4K-m9g",
    authDomain: "typeglow-4d67d.firebaseapp.com",
    projectId: "typeglow-4d67d",
    storageBucket: "typeglow-4d67d.firebasestorage.app",
    messagingSenderId: "463907606470",
    appId: "1:463907606470:web:630e15cb8a9dc6d421ecc7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Authentication State Management
auth.onAuthStateChanged(user => {
    const isLoginPage = window.location.pathname.includes("index.html");
    const isAppPage = window.location.pathname.includes("app.html");
    
    if (!user && isAppPage) {
        window.location.href = "index.html";
    }
    if (user && isLoginPage) {
        window.location.href = "app.html";
    }
});

// DOM Elements
const domElements = {
    startButton: document.getElementById('startButton'),
    durationSelect: document.getElementById('durationSelect'),
    timerDisplay: document.getElementById('timer'),
    displayText: document.getElementById('displayText'),
    resultsScreen: document.getElementById('resultsScreen'),
    wpmDisplay: document.getElementById('wpmDisplay'),
    accuracyDisplay: document.getElementById('accuracyDisplay'),
    rawSpeedDisplay: document.getElementById('rawSpeedDisplay'),
    historyButton: document.getElementById('historyButton'),
    resultsBackdrop: document.getElementById('resultsBackdrop'),
    logoutButton: document.getElementById('logoutButton'),
    modeSelect: document.getElementById('modeSelect')
};

// Application State
let appState = {
    timer: null,
    timeLeft: 0,
    isTestRunning: false,
    currentIndex: 0,
    linesOfText: [],
    lineTransitioning: false,
    history: JSON.parse(localStorage.getItem('typingHistory')) || [],
    usedWords: new Set(),
    lineBuffer: 5,
    timerStarted: false
};

// Text Generation Configuration
const generationRules = {
    base: "Generate content for typing test. Strict rules: NO 3-letter words, NO word repetitions in session.",
    modes: {
        comma: "Create complex sentences with multiple commas (15-20 words).",
        punctuation: "Sentence with varied punctuation (!?;-) (15-20 words).",
        numbers: "Insert numbers after every two words (15-20 words).",
        symbols: "Include symbols after every word (15-20 words).",
        caseSensitive: "Capitalize every 2-3 words randomly (15-20 words).",
        default: "15-20 random lowercase words (4-8 letters). NO MEANING."
    },
    fallbackWords: [
        'quantum','nebula','velocity','sapphire','phantom','galaxy',
        'vortex','chroma','pulse','zenith','echo','lunar','digital',
        'fusion','crystal','matrix','photon','infinity','dynamic',
        'spectrum','neon','orbit','vector','hyper','cosmic','frequency'
    ]
};

// API Configuration
const API_CONFIG = {
    KEY: 'AlzaSyDignJlIEGilMpBX4exdCVX_pbIWuwHFaRk',
    URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};

// Logout Handler
if (domElements.logoutButton) {
    domElements.logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Logout error:', error);
        });
    });
}

// Text Generation Functions
async function generateRandomLine() {
    const mode = domElements.modeSelect.value;
    const prompt = `${generationRules.base} ${generationRules.modes[mode]}`;

    try {
        const response = await fetch(`${API_CONFIG.URL}?key=${API_CONFIG.KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        return processGeneratedText(data.candidates[0].content.parts[0].text, mode);
    } catch (error) {
        console.error('API Error:', error);
        return generateFallbackText(mode);
    }
}

function processGeneratedText(text, mode) {
    let processed = text.replace(/\b\w{1,3}\b/g, '').replace(/\s+/g, ' ').trim();
    
    // Mode-specific processing
    switch(mode) {
        case 'numbers':
            processed = processed.split(' ').map((word, index) => 
                (index % 3 === 2) ? `${word} ${Math.floor(Math.random() * 100)}` : word
            ).join(' ');
            break;
            
        case 'symbols':
            const symbols = ['#', '@', '&', '*', '$', '%', '^'];
            processed = processed.split(' ').map(word => 
                word + symbols[Math.floor(Math.random() * symbols.length)]
            ).join(' ');
            break;
            
        case 'caseSensitive':
            processed = processed.split(' ').map((word, index) => 
                (index % 3 === 0) ? word.toUpperCase() : word.toLowerCase()
            ).join(' ');
            break;
    }

    // Filter unique words
    const words = processed.split(' ').filter(word => 
        word.length >= 4 && !appState.usedWords.has(word)
    );
    words.forEach(word => appState.usedWords.add(word));
    
    return words.join(' ') || generateFallbackText(mode);
}

function generateFallbackText(mode) {
    const availableWords = generationRules.fallbackWords.filter(word => 
        !appState.usedWords.has(word)
    );
    const selectedWords = [];
    
    while (selectedWords.length < 15 && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords.splice(randomIndex, 1)[0];
        selectedWords.push(word);
        appState.usedWords.add(word);
    }

    return mode === 'default' ? 
        selectedWords.join(' ') : 
        createModeSpecificFallback(selectedWords, mode);
}

function createModeSpecificFallback(words, mode) {
    switch(mode) {
        case 'comma': 
            return words.reduce((acc, word, index) => 
                `${acc}${word}${(index % 3 === 2) ? ', ' : ' '}`, '').trim().slice(0, -1) + '.';
        case 'numbers':
            return words.map((word, index) => 
                (index % 3 === 2) ? `${word} ${Math.floor(Math.random() * 100)}` : word
            ).join(' ');
        case 'symbols':
            const symbols = ['#', '@', '&', '*', '$', '%', '^'];
            return words.map(word => word + symbols[Math.floor(Math.random() * symbols.length)]).join(' ');
        case 'caseSensitive':
            return words.map((word, index) => 
                (index % 3 === 0) ? word.toUpperCase() : word.toLowerCase()
            ).join(' ');
        default:
            return words.join(' ');
    }
}

// UI Functions
function highlightCurrentCharacter() {
    const characters = domElements.displayText.querySelectorAll('span');
    characters.forEach((char, index) => {
        char.classList.toggle('highlight', index === appState.currentIndex);
        
        if (index === appState.currentIndex) {
            const scrollLeft = char.offsetLeft - (domElements.displayText.offsetWidth / 2);
            domElements.displayText.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    });
}

function startTimer() {
    appState.timer = setInterval(() => {
        appState.timeLeft--;
        domElements.timerDisplay.textContent = appState.timeLeft;
        if (appState.timeLeft <= 0) endTest();
    }, 1000);
}

// Test Management
async function startTest() {
    if (appState.isTestRunning) return;
    
    // Reset state
    appState.usedWords.clear();
    appState.linesOfText = [];
    appState.currentIndex = 0;
    appState.isTestRunning = true;
    appState.timerStarted = false;
    clearInterval(appState.timer);
    
    // Clear UI
    domElements.displayText.innerHTML = '';
    domElements.resultsScreen.style.display = 'none';
    domElements.resultsBackdrop.style.display = 'none';
    
    // Set initial time
    appState.timeLeft = parseInt(domElements.durationSelect.value);
    domElements.timerDisplay.textContent = appState.timeLeft;

    // Generate initial lines
    try {
        const lines = await Promise.all(Array(5).fill().map(() => generateRandomLine()));
        appState.linesOfText = lines.filter(line => line.length > 0);
        domElements.displayText.innerHTML = appState.linesOfText.slice(0, 3)
            .map(line => `<div class="line">${line.split('').map(c => `<span>${c}</span>`).join('')}</div>`)
            .join('');
    } catch (error) {
        console.error('Initial line generation failed:', error);
    }

    // Start line buffer maintenance
    maintainLineBuffer();
    highlightCurrentCharacter();
}

async function maintainLineBuffer() {
    while (appState.isTestRunning) {
        if (appState.linesOfText.length < appState.lineBuffer) {
            try {
                const newLine = await generateRandomLine();
                appState.linesOfText.push(newLine);
            } catch (error) {
                appState.linesOfText.push(generateFallbackText('default'));
            }
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// Input Handling
window.addEventListener('keydown', (e) => {
    if (!appState.isTestRunning || e.key.length !== 1) return;

    if (!appState.timerStarted) {
        appState.timerStarted = true;
        startTimer();
    }

    const characters = domElements.displayText.querySelectorAll('span');
    if (appState.currentIndex >= characters.length) return;

    const expectedChar = characters[appState.currentIndex].textContent;
    const isCorrect = domElements.modeSelect.value === 'caseSensitive' ?
        e.key === expectedChar :
        e.key.toLowerCase() === expectedChar.toLowerCase();

    characters[appState.currentIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    appState.currentIndex++;
    
    if (appState.currentIndex > characters.length * 0.8) {
        handleLineTransition();
    }

    highlightCurrentCharacter();
});

function handleLineTransition() {
    if (appState.lineTransitioning || appState.linesOfText.length < 4) return;
    appState.lineTransitioning = true;

    // Remove old line
    const oldLine = appState.linesOfText.shift();
    oldLine.split(' ').forEach(word => appState.usedWords.delete(word));
    domElements.displayText.firstElementChild.remove();

    // Add new line
    const newLine = appState.linesOfText[2];
    const newLineElement = document.createElement('div');
    newLineElement.className = 'line';
    newLineElement.innerHTML = newLine.split('').map(c => `<span>${c}</span>`).join('');
    domElements.displayText.appendChild(newLineElement);

    // Adjust current index
    const firstLineLength = domElements.displayText.firstElementChild?.querySelectorAll('span').length || 0;
    appState.currentIndex = Math.max(0, appState.currentIndex - firstLineLength);
    
    appState.lineTransitioning = false;
    highlightCurrentCharacter();
}

// Results System
function endTest() {
    clearInterval(appState.timer);
    appState.isTestRunning = false;

    const totalChars = appState.currentIndex;
    const correctChars = domElements.displayText.querySelectorAll('.correct').length;
    const durationMinutes = parseInt(domElements.durationSelect.value) / 60;

    const results = {
        wpm: Math.round((totalChars / 5 / durationMinutes) * (correctChars / totalChars || 0)),
        accuracy: Math.round((correctChars / totalChars || 0) * 100),
        rawSpeed: Math.round(totalChars / 5 / durationMinutes),
        date: new Date().toLocaleString()
    };

    appState.history.push(results);
    localStorage.setItem('typingHistory', JSON.stringify(appState.history));

    domElements.resultsScreen.innerHTML = `
        <div class="close-results">✕</div>
        <div>WPM: ${results.wpm}</div>
        <div>Accuracy: ${results.accuracy}%</div>
        <div>Raw Speed: ${results.rawSpeed}</div>
    `;
    domElements.resultsBackdrop.style.display = 'block';
    domElements.resultsScreen.style.display = 'block';

    document.querySelector('.close-results').addEventListener('click', () => {
        domElements.resultsBackdrop.style.display = 'none';
        domElements.resultsScreen.style.display = 'none';
    });
}

// History System
function toggleHistory() {
    // Show the results screen with history data
    domElements.resultsBackdrop.style.display = 'block';
    domElements.resultsScreen.style.display = 'block';
    
    // Display history in the results screen
    domElements.resultsScreen.innerHTML = `
        <div class="close-results">✕</div>
        <h3>Recent Tests</h3>
        ${appState.history.slice(-3).map(entry => `
            <div class="logEntry">
                <strong>${entry.date}</strong><br>
                WPM: ${entry.wpm}<br>
                Accuracy: ${entry.accuracy}%<br>
                Raw: ${entry.rawSpeed}
            </div>
        `).join('')}
    `;
    
    document.querySelector('.close-results').addEventListener('click', () => {
        domElements.resultsBackdrop.style.display = 'none';
        domElements.resultsScreen.style.display = 'none';
    });
}

// Event Listeners
if (domElements.startButton) {
    domElements.startButton.addEventListener('click', startTest);
    domElements.historyButton.addEventListener('click', toggleHistory);
}

// Initial Setup
if (domElements.displayText) {
    domElements.displayText.innerHTML = '<div class="line"></div>'.repeat(3);
}
