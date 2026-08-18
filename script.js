'use strict';

const frame = document.getElementById('googleFrame');

// ===== رفتن به خانه =====
function goHome() {
    frame.src = 'https://www.google.com/webhp?igu=1';
}

// ===== رفرش =====
function reloadFrame() {
    frame.src = frame.src;
}

// ===== تب جدید (پنجره جدید) =====
function openNewTab() {
    window.open('https://www.google.com/', '_blank');
}

// ===== اگه گوگل لود نشد =====
frame.addEventListener('error', () => {
    frame.src = 'https://duckduckgo.com/';
});
