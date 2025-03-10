* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: #121212;
    color: #00ffcc;
    font-family: "Orbitron", sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
}

.container {
    width: 90%;
    max-width: 800px;
    text-align: center;
    position: relative;
}

#logo {
    font-size: 28px;
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
    position: fixed;
    top: 20px;
    left: 20px;
    letter-spacing: 4px;
    animation: glow 1.5s ease-in-out infinite alternate;
    z-index: 1000;
}

#displayText {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    border-top: 3px solid #00ffcc;
    border-bottom: 3px solid #00ffcc;
    padding: 25px 0;
    white-space: nowrap;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    box-shadow: 0 0 30px rgba(0, 255, 204, 0.2);
}

#displayText::-webkit-scrollbar {
    display: none;
}

#timer {
    position: fixed;
    left: 20px;
    top: 360px;
    font-size: 2.5em;
    color: #ff0066;
    text-shadow: 0 0 15px #ff0066;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border: 2px solid #ff0066;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(255, 0, 102, 0.3);
}

#controls {
    position: fixed;
    top: 100px;
    left: 20px;
    display: flex;
    gap: 15px;
    flex-direction: column;
    z-index: 999;
}

#historyLog {
    position: fixed;
    top: 390px;
    left: 20px;
    background: rgba(0, 0, 0, 0.9);
    padding: 20px;
    border: 2px solid #00ffcc;
    border-radius: 10px;
    max-width: 300px;
    z-index: 999;
}

.line {
    display: inline-block;
    margin: 0 40px;
    vertical-align: bottom;
    padding: 15px 25px;
    border-radius: 8px;
    background: rgba(0, 255, 204, 0.05);
}

span {
    display: inline-block;
    min-width: 16px;
    padding: 3px;
    font-size: 1.4em;
    position: relative;
    transition: all 0.1s ease;
}

span.highlight {
    background: rgba(0, 255, 204, 0.3);
    transform: scale(1.1);
    animation: cursor-pulse 1s infinite;
}

@keyframes cursor-pulse {
    0% { box-shadow: 0 0 5px #00ffcc; }
    50% { box-shadow: 0 0 15px #00ffcc; }
    100% { box-shadow: 0 0 5px #00ffcc; }
}

span.correct {
    color: #00ff00;
    text-shadow: 0 0 10px #00ff00;
}

span.incorrect {
    color: #ff0066;
    text-shadow: 0 0 10px #ff0066;
    position: relative;
}

#resultsBackdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 2000;
    display: none;
}

#resultsScreen {
    position: fixed;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -60%);
    background: rgba(0, 0, 0, 0.95);
    padding: 40px;
    border: 3px solid #00ffcc;
    border-radius: 15px;
    box-shadow: 0 0 40px rgba(0, 255, 204, 0.5);
    z-index: 2001;
    width: 90%;
    max-width: 500px;
    text-align: center;
}

.close-results {
    position: absolute;
    top: 15px;
    right: 20px;
    color: #ff0066;
    cursor: pointer;
    font-size: 1.5em;
    transition: all 0.3s ease;
}

.close-results:hover {
    transform: scale(1.2);
    text-shadow: 0 0 15px #ff0066;
}

#resultsScreen div {
    margin: 15px 0;
    font-size: 1.4em;
    text-shadow: 0 0 10px #00ffcc;
}

select, button {
    background: #000;
    color: #00ffcc;
    border: 2px solid #00ffcc;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
}

button:hover {
    background: #00ffcc;
    color: #000;
    box-shadow: 0 0 25px #00ffcc;
    transform: translateY(-2px);
}

@keyframes glow {
    from { text-shadow: 0 0 10px #00ff00; }
    to { text-shadow: 0 0 30px #00ff00; }
}

@media (max-width: 768px) {
    #logo {
        font-size: 20px;
        top: 15px;
        left: 15px;
    }

    #timer {
        left: 50%;
        top: auto;
        bottom: 140px;
        transform: translateX(-50%);
        width: auto;
        white-space: nowrap;
        font-size: 2em;
        padding: 8px 16px;
    }

    #controls {
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
    }

    #historyLog {
        top: 280px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
    }

    .line {
        margin: 0 20px;
        padding: 10px 15px;
    }

    span {
        font-size: 1.2em;
    }

    #resultsScreen {
        top: 65%;
        transform: translate(-50%, -65%);
        padding: 25px;
    }
}

.logEntry {
    background: rgba(0, 0, 0, 0.8);
    padding: 15px;
    margin: 15px 0;
    border: 2px solid #00ffcc;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
}

/* Add to styles.css */
.auth-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.auth-box {
    background: rgba(0, 0, 0, 0.9);
    padding: 40px;
    border: 3px solid #00ffcc;
    border-radius: 15px;
    box-shadow: 0 0 40px rgba(0, 255, 204, 0.5);
    width: 400px;
    max-width: 90%;
}

.auth-button {
    background: #000;
    color: #00ffcc;
    border: 2px solid #00ffcc;
    padding: 12px 24px;
    margin: 10px 0;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
}

.auth-button img {
    width: 24px;
    height: 24px;
}

.auth-button:hover {
    background: #00ffcc;
    color: #000;
}

input[type="email"],
input[type="password"] {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    background: #000;
    border: 2px solid #00ffcc;
    color: #00ffcc;
    font-family: 'Orbitron', sans-serif;
}

.separator {
    margin: 20px 0;
    position: relative;
    color: #00ffcc;
    text-align: center;
}

.separator::before,
.separator::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #00ffcc;
}

.separator::before { left: 0; }
.separator::after { right: 0; }

.auth-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

/* Logout button styling */
#logoutButton {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    font-size: 14px;
    width: auto;
    z-index: 1000;
}

/* For mobile responsiveness */
@media (max-width: 768px) {
    #logoutButton {
        top: 15px;
        right: 15px;
        padding: 6px 12px;
        font-size: 12px;
    }
}