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
    base: "Generate content for typing test. Do not use any 3 letter words. Ensure there are no word repetitions in session.",
    modes: {
        comma: "Create complex sentences with multiple commas (15-20 words).",
        numbers: "Insert numbers after every two words (15-20 words).",
        symbols: "Include symbols after every word (15-20 words).",
        caseSensitive: "Capitalize every 2-3 words randomly (15-20 words).",
        default: "15-20 random lowercase words (4-8 letters).  Make up random words with random letter combinations."
    },
    fallbackWords: [
        // Core technical
        'quantum', 'nebula', 'velocity', 'sapphire', 'phantom', 'galaxy', 'entropy',
        'vortex', 'chroma', 'pulse', 'zenith', 'echo', 'lunar', 'digital', 'flux',
        'fusion', 'crystal', 'matrix', 'photon', 'infinity', 'dynamic', 'tesseract','moxe', 'flim', 'gorp', 'wift', 'byre', 'clot', 'davy', 'fech', 'gawm', 'hoxy', 'jurl', 'kyte', 'lave', 'milt',
          'noil', 'orby', 'pash', 'quip', 'ryke', 'toze', 'vawn', 'wift', 'xylo', 'yech', 'zurn','blot', 'crin', 'doff', 'fain',
          'gowl', 'haze', 'joky', 'kray', 'lode', 'mope', 'nosh', 'owly', 'pith', 'quag', 'rant', 'trop', 'virl', 'wade',
          'xyst', 'yolk', 'zany', 'bode', 'cuny', 'dreg', 'flab', 'goby', 'hurl', 'jinx', 'keel', 'lurk', 'moat', 'naut', 'oily',
          'pock', 'quib', 'rowt', 'tofu', 'vamp', 'woof', 'xyre', 'yack','braw', 'cloy', 'dirl', 'fawn', 'glox', 'haze',
          'jock', 'krag', 'loon', 'narp', 'noyp', 'ofix', 'pize', 'quip', 'ramp', 'toil', 'volt', 'weld', 'xeme', 'yird','blug', 'croc', 'doxx', 'feck', 'glop', 'hurl', 'jolt', 'knur', 'luny', 'mird', 'nary', 'ogre', 'plox', 'quid', 'raze',
          'tump', 'vrax', 'wize', 'xurt', 'yarn', 'zuff', 'bort', 'crug', 'dorn', 'flep', 'gant', 'hump', 'jarp', 'kipz', 'loft',
          'moxz', 'narp', 'ovet', 'palt', 'qoph', 'rext', 'tuft', 'volm', 'wirt', 'xant', 'yern', 'cump', 'dyze', 'flet',
        'gorn', 'harl', 'jump', 'kelt', 'lopt', 'motz', 'nift', 'otly', 'plax', 'quim', 'royt', 'voxy', 'waze', 'xent', 'yink',
        // Computer
        'recursion', 'algorithm', 'polymorph', 'obfuscate', 'quantize', 'isomorphic',
        'nanocluster', 'metamorph', 'cybernetic', 'dystopian', 'holograph', 'symbiosis',
        // Biology 
        'biolumine','biodome','hydroponic','luminescent','kinetic',
        
        // Emerging tech
        'xenon','yottabyte','zeitgeist','vaporwave','wavelength','oscillate',
        'kaleidoscope','juxtapose','paradox','algorithmic','astral','synthetic',
        
        // Rare/novel terms
        'chronostasis','eigenvalue','flabbergast','gobbledygook','hemidemisemiquaver',
        'idempotent', 'jackanapes', 'kludge', 'mnemonic', 'nondescript', 'onomatopoeia',
        'persnickety', 'quintessential', 'ratiocinate', 'sesquipedalian', 'tintinnabulation',
        'umlaut', 'verisimilitude', 'welterweight', 'xanthophyll', 'yammer', 'zeugma','bloc', 'furl', 'grit', 'jamb', 'lurk', 'mump', 'numb', 'plop', 'quid', 'rift', 'tuxy', 'verv', 'warp', 'xyl',
        'blix', 'crub', 'durn', 'flit', 'goth', 'harl', 'jimp', 'klit', 'long', 'muld', 'nipt', 'obyz', 'plex', 'quim',
        'rint', 'turb', 'vark', 'wolt', 'xyme', 'yelt', 'borg', 'crul', 'ditz', 'floy', 'girt', 'hyte', 'jilt', 'kump',
        'loyn', 'nurl', 'oxen', 'plix', 'quin', 'royl', 'tarn', 'vert', 'woof', 'xurt', 'yird', 'blud', 'crut', 'duff',
        'fluz', 'gurn', 'harp', 'jove', 'kipp', 'luff', 'moit', 'noul', 'oyst', 'pout', 'quap', 'rute', 'tore', 'vort', 'wyle',
        'xant', 'yote', 'zurb', 'bylt', 'crat', 'doil', 'flut', 'gran', 'jolt', 'kirt', 'lopy', 'mort', 'noup', 'oink', 'ruft',
        'trum', 'vold', 'wurn', 'xure', 'yurt', 'zort', 'bloc', 'frip', 'glab', 'hoax', 'jinx', 'lump', 'munt', 'natz', 'opus',
        'poxy', 'rowt', 'tarp', 'vane', 'womp', 'xyre','brax', 'clum', 'dray', 'fain', 'glob', 'huip', 'jork', 'kilp',
        'lorn', 'milt', 'nowt', 'opts', 'ploy', 'rant', 'trug', 'voxy', 'wize', 'yack', 'brut', 'crul', 'dole', 'goof',
        'hump', 'juvy', 'krep', 'loit', 'mutt', 'nazy', 'obey', 'plat', 'quit', 'roil', 'torn', 'vrow', 'wail', 'xylo',
        'bary', 'clop', 'dirl', 'fawn', 'glox', 'haze', 'jock', 'krag', 'loon', 'narp', 'noyp', 'ofix', 'pize', 'quip', 'volt',
        'xeme','blug', 'croc', 'doxx', 'feck', 'glop', 'hurl', 'knur', 'luny', 'mird', 'nary', 'ogre', 'plox', 'raze',
        'tump', 'vrax', 'wize', 'xurt', 'yarn', 'zuff',
        // More diverse 4/5 letter words
        'amber', 'azure', 'brass', 'cedar', 'coral', 'ebony', 'flint', 'ivory',
        'jade', 'khaki', 'linen', 'mauve', 'ochre', 'periwinkle', 'raven', 
        'sepia', 'umber', 'vermilion', 'wheat', 'agate', 'beige', 'champagne',
        'copper', 'cream', 'daffodil', 'denim', 'fuchsia', 'ginger', 'garnet', 'hickory',
        'indigo', 'lavender', 'magenta', 'maroon', 'opal', 'plum', 'rust', 'salmon',
        'tan', 'taupe', 'thistle', 'topaz', 'violet', 'cider', 'lemon', 'mango',
        'minty', 'olive', 'peach', 'berry', 'almond', 'arbutus', 'auburn', 'bistre', 'blush', 'burlap', 'butterscotch', 'carmine',
        'celadon', 'cerulean', 'charcoal', 'chartreuse', 'claret', 'clove', 'cobweb', 'cochineal',
        'cornsilk', 'cypress', 'damask', 'dandelion', 'dove', 'ecru', 'eggshell', 'eldritch',
        'fern', 'fallow', 'feldspar', 'fog', 'galena', 'gamboge', 'glaucous', 'granite',
        'gunmetal', 'heliotrope', 'hemp', 'henna', 'honeydew', 'iceberg', 'iris', 'iron',
        'isabelline', 'jasmine', 'jonquil', 'kaolin', 'kelp', 'lapis', 'larch', 'lazuli',
        'lichen', 'mahogany', 'mallow', 'manzanita', 'maple', 'merlot', 'mica', 'mocha',
        'mulberry', 'musk', 'myrtle', 'nacre', 'navel', 'nectarine', 'nickel', 'obsidian',
        'ocherous', 'onyx', 'pansy', 'papaya', 'parchment', 'patina', 'pewter', 'pine',
        'porcelain', 'pumice', 'quartz', 'quince', 'raisin', 'reed', 'roan', 'rosewood',
        'saffron', 'sangria', 'sienna', 'silica', 'silken', 'slate', 'smoke', 'snowdrop',
        'sorrel', 'spruce', 'straw', 'sulfur', 'tamarind', 'tangerine', 'tannin', 'tarragon',
        'teak', 'terra', 'tin', 'titanium', 'tundra', 'turmeric', 'umbered', 'wisteria','vrow'
      ]
};


// Retry wrapper for API calls
// API Configuration
const API_CONFIG = {

    KEY: 'AIzaSyCM1rMjhdJAilpz6MMfE2-eaT6gG4K-m9g',
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
        const response = await fetchWithRetry(`${API_CONFIG.URL}?key=${API_CONFIG.KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }],
                    safetySettings: [
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ],
                    systemInstruction: {
                        parts: [{
                            text: "You are a technical term generator. Create novel, complex words using scientific roots. Prioritize uniqueness over meaning."
                        }]
                    },
                    generationConfig: {
                        temperature: 1.0,
                        maxOutputTokens: 250,
                        topP: 0.95,
                        topK: 40
                    }
                }]
            })
        }, 2);
        const data = await response.json();
        return processGeneratedText(data.candidates[0].content.parts[0].text, mode);
    } catch (error) {
        console.error('API Error:', error);
         return generateFallbackText(mode);
    }
}
    
function processGeneratedText(text, mode) {let processed = text.replace(/\b\w{1,2}\b/g, '').replace(/\s+/g, ' ').trim();
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

        const words = processed.split(' ').filter(word => {
            return !appState.usedWords.has(word) &&
            !/(\w)\1{2,}/.test(word) &&
            // Block repeated characters
            !/[aeiou]{3}/i.test(word) && // Block vowel clusters
            !/(.)\1.{2}\1/i.test(word) // Block phonetic patterns
        });
        words.forEach(word => appState.usedWords.add(word));
    
    return words.join(' ') || generateFallbackText(mode);
}

function generateFallbackText(mode) {
    const availableWords = generationRules.fallbackWords.filter(word => 
        !appState.usedWords.has(word)
    );
    const selectedWords = [];
    
    // Shuffle available words using Fisher-Yates algorithm
    for (let i = availableWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableWords[i], availableWords[j]] = [availableWords[j], availableWords[i]];
    }
    
    // Select first 15 unique words from shuffled list
    selectedWords.push(...availableWords.splice(0, 15).filter(word =>
        !appState.usedWords.has(word)
    ));
    
    selectedWords.forEach(word => appState.usedWords.add(word));

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
            const symbols = ['#', '@', '&', '*', '$', '%', '^', '~', '§', '¶', '¢', '£', '¥'];
            return words.map(word => word + symbols[Math.floor(Math.random() * symbols.length)]).join(' ');
        case 'caseSensitive':
            return words.map((word, index) => 
                (index % 3 === 0) ? word.toUpperCase() : word.toLowerCase()
            ).join(' ');
    default:
        return words.join(' ');
    }
}

async function fetchWithRetry(url, options, retries = 1) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
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
    // Clear existing test if running
    if (appState.isTestRunning) {
        clearInterval(appState.timer);
        appState.isTestRunning = false;
    }

    // Reset state
    appState.usedWords.clear();
    appState.linesOfText = [];
    appState.currentIndex = 0;
    appState.isTestRunning = true;
    appState.timeLeft = parseInt(domElements.durationSelect.value);
    appState.timerStarted = false;
    domElements.timerDisplay.textContent = appState.timeLeft;
    domElements.resultsScreen.style.display = 'none';

    // Generate and display content
    const lines = await Promise.all(Array(3).fill().map(() => generateRandomLine()));
    appState.linesOfText = lines;
    domElements.displayText.innerHTML = appState.linesOfText.map(line => `<div class="line">${line.split('').map(c => `<span>${c}</span>`).join('')}</div>`).join('');    
    maintainLineBuffer(); // Run without await to avoid blocking
    highlightCurrentCharacter(); // Highlight the first character
}
async function maintainLineBuffer() {
    while (appState.isTestRunning) {
        if (appState.linesOfText.length < appState.lineBuffer) {
            try {
                const newLine = await generateRandomLine();
                appState.linesOfText.push(newLine);
            } catch(error) {
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
    domElements.startButton.disabled = false;
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
// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (domElements.startButton) {
        domElements.startButton.addEventListener('click', startTest);
        domElements.historyButton.addEventListener('click', toggleHistory);
    }
    
    // Initial text buffer population
    if (domElements.displayText) {
        domElements.displayText.innerHTML = appState.linesOfText.map(line =>
            `<div class="line">${line.split('').map(c => `<span>${c}</span>`).join('')}</div>`
        ).join('');
    }
});

// Initial Setup
if (domElements.displayText) {
    domElements.displayText.innerHTML = '<div class="line"></div>'.repeat(3);
}

// Create background particles
function createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.width = particle.style.height =
            Math.random() * 4 + 2 + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        document.body.appendChild(particle);
    }
}

window.addEventListener('load', createParticles);

