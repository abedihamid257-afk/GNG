const frame = document.getElementById('googleFrame');
const overlay = document.getElementById('gngOverlay');

function goHome() {
    frame.src = 'https://www.google.com/webhp?igu=1';
    showOverlay();
}

function reloadFrame() {
    frame.src = frame.src;
}

function hideOverlay() {
    overlay.classList.add('hidden');
}

function showOverlay() {
    overlay.classList.remove('hidden');
}

// وقتی گوگل لود شد، لوگو رو مخفی کن
frame.addEventListener('load', () => {
    setTimeout(() => {
        hideOverlay();
    }, 1000);
});

// اول صفجه لوگوی GNG نشون بده
showOverlay();
