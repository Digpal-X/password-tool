const passwordInput = document.getElementById('passwordInput');
const strengthBar = document.getElementById('strengthBar');
const feedback = document.getElementById('feedback');
const timeText = document.getElementById('timeText');

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const result = calculateStrength(password);
    updateUI(result);
});

function calculateStrength(password) {
    let score = 0;
    
    // 1. Length Check
    if (password.length > 8) score += 20;
    if (password.length > 12) score += 20;
    
    // 2. Complexity Check
    if (/[A-Z]/.test(password)) score += 15; // Capital Letter
    if (/[0-9]/.test(password)) score += 15; // Number
    if (/[^A-Za-z0-9]/.test(password)) score += 30; // Symbol (!@#)

    return Math.min(score, 100);
}

function updateUI(score) {
    strengthBar.style.width = `${score}%`;

    if (score < 40) {
        strengthBar.style.backgroundColor = "red";
        feedback.innerText = "Weak (Easily Cracked)";
        timeText.innerText = "Instant";
    } else if (score < 80) {
        strengthBar.style.backgroundColor = "orange";
        feedback.innerText = "Moderate";
        timeText.innerText = "3 Days (GPU Rig)";
    } else {
        strengthBar.style.backgroundColor = "#00ff41";
        feedback.innerText = "Strong";
        timeText.innerText = "400 Years";
    }

}
