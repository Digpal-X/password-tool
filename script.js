const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const powerCells = document.querySelectorAll('.power-cell');
const timeText = document.getElementById('timeText');
const toolText = document.getElementById('toolText');
const feedback = document.getElementById('feedback');
const levelText = document.getElementById('levelText');
const root = document.documentElement;

// --- MATRIX RAIN SETUP ---
const canvas = document.getElementById('hacker-rain');
const ctx = canvas.getContext('2d');

// Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "0101010101XYZAAB"; // Binary + Hex feel
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for(let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    // 1. Fade effect (Trail)
    ctx.fillStyle = "rgba(5, 5, 16, 0.1)"; // Dark fade matching bg
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Set Dynamic Color (Matches the Interface Theme)
    const themeColor = getComputedStyle(root).getPropertyValue('--theme-color').trim();
    ctx.fillStyle = themeColor; 
    ctx.font = fontSize + "px monospace";

    // 3. Draw drops
    for(let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 40); // Run animation

// Handle Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// --- PASSWORD LOGIC ---
const commonPasswords = ["123456", "password", "qwerty", "admin", "welcome", "12345678", "iloveyou"];

// Text Scrambler
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function hackerTextEffect(element, finalText) {
    let iteration = 0;
    clearInterval(element.interval);
    element.interval = setInterval(() => {
        element.innerText = finalText
            .split("")
            .map((letter, index) => {
                if(index < iteration) return finalText[index];
                return letters[Math.floor(Math.random() * 36)];
            })
            .join("");
        if(iteration >= finalText.length) clearInterval(element.interval);
        iteration += 1 / 2;
    }, 30);
}

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    updateUI(calculateEntropy(password), password);
});

document.getElementById('genBtn').addEventListener('click', () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for(let i=0; i<20; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    passwordInput.value = pass;
    updateUI(calculateEntropy(pass), pass);
    feedback.innerHTML = `<span class="blink">></span> KEY_GENERATED`;
});

document.getElementById('copyBtn').addEventListener('click', () => {
    if(passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        feedback.innerHTML = `<span class="blink">></span> COPIED_TO_CLIPBOARD`;
    }
});

function calculateEntropy(password) {
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
    if (password.length === 0) return { bits: 0, time: "INSTANT" };
    
    const entropy = password.length * Math.log2(poolSize);
    const combinations = Math.pow(2, entropy);
    return { bits: Math.floor(entropy), seconds: combinations / 100000000000 };
}

function formatTime(seconds) {
    if (seconds < 1) return "INSTANT";
    if (seconds < 60) return Math.round(seconds) + " SECS";
    if (seconds < 3600) return Math.round(seconds/60) + " MINS";
    if (seconds < 86400) return Math.round(seconds/3600) + " HRS";
    if (seconds < 31536000) return Math.round(seconds/86400) + " DAYS";
    if (seconds < 3153600000) return Math.round(seconds/31536000) + " YRS";
    return "CENTURIES";
}

function updateUI(result, password) {
    const bits = result.bits;
    
    powerCells.forEach(cell => cell.className = 'power-cell');
    
    let color = "#444";
    let toolName = "WAITING...";
    let activeCells = 0;
    let level = 0;

    if (commonPasswords.includes(password.toLowerCase())) {
        color = "#ff003c"; // BLOOD RED
        toolName = "DICTIONARY ATTACK";
        activeCells = 2;
        level = 1;
        feedback.innerHTML = `<span class="blink" style="color:${color}">></span> CRITICAL_FAILURE: COMMON_PASS`;
    } else {
        if (bits < 40) {
            color = "#ff2a2a"; // Red-Orange
            toolName = "RAINBOW TABLE";
            activeCells = 3;
            level = 2;
        } else if (bits < 60) {
            color = "#ffae00"; // TOXIC YELLOW
            toolName = "GPU BRUTEFORCE";
            activeCells = 5;
            level = 5;
        } else if (bits < 80) {
            color = "#00ff41"; // Standard Green
            toolName = "HYBRID CRACK";
            activeCells = 7;
            level = 7;
        } else {
            color = "#00f0ff"; // CYBER BLUE
            toolName = "QUANTUM RESISTANT";
            activeCells = 10;
            level = 10;
        }
        feedback.innerHTML = `<span class="blink">></span> ANALYZING_HASH...`;
    }

    // THIS UPDATES GRID AND RAIN COLOR INSTANTLY
    root.style.setProperty('--theme-color', color);

    for(let i=0; i<activeCells; i++) {
        powerCells[i].classList.add('active');
    }

    timeText.innerText = formatTime(result.seconds);
    hackerTextEffect(toolText, toolName);
    levelText.innerText = level;
}
