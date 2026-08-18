const frame = document.getElementById('searchFrame');

// ===== سایت‌ها — بدون گوگل =====
const searchSites = [
    'https://www.startpage.com/',
    'https://duckduckgo.com/',
    'https://www.bing.com/',
    'https://search.brave.com/',
    'https://www.ecosia.org/',
    'https://www.qwant.com/',
    'https://www.mojeek.com/',
    'https://www.yahoo.com/',
    'https://www.yandex.com/'
];

let currentIndex = 0;

function init() {
    frame.src = searchSites[0];
}

function goHome() {
    currentIndex = 0;
    frame.src = searchSites[0];
}

function reloadFrame() {
    frame.src = frame.src;
}

function tryNext() {
    currentIndex++;
    if (currentIndex >= searchSites.length) {
        currentIndex = 0;
    }
    frame.src = searchSites[currentIndex];
}

frame.addEventListener('load', () => {
    console.log('✅ لود شد:', searchSites[currentIndex]);
});

init();
