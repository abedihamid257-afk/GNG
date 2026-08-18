const frame = document.getElementById('googleFrame');

function goHome() {
    frame.src = 'https://www.google.com/webhp?igu=1';
}

function reloadFrame() {
    frame.src = frame.src;
}
