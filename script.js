const frame = document.getElementById('searchFrame');

// ===== لیست سایت‌های جستجو (به ترتیب) =====
const searchSites = [
    'https://www.startpage.com/',
    'https://duckduckgo.com/',
    'https://www.bing.com/',
    'https://search.brave.com/',
    'https://www.ecosia.org/',
    'https://www.qwant.com/',
    'https://www.mojeek.com/',
    'https://search.marginalia.nu/',
    'https://www.google.com/webhp?igu=1',
    'https://www.yahoo.com/',
    'https://www.yandex.com/'
];

let currentIndex = 0;
let loaded = false;

// ===== شروع با اولین سایت =====
function init() {
    frame.src = searchSites[0];
}

// ===== رفتن به خانه (اولین سایت) =====
function goHome() {
    currentIndex = 0;
    frame.src = searchSites[0];
}

// ===== رفرش =====
function reloadFrame() {
    frame.src = frame.src;
}

// ===== رفتن به سایت بعدی =====
function tryNext() {
    currentIndex++;
    
    if (currentIndex >= searchSites.length) {
        currentIndex = 0;
    }
    
    frame.src = searchSites[currentIndex];
}

// ===== اگه سایت لود نشد، خودکار بعدی =====
frame.addEventListener('error', () => {
    tryNext();
});

// ===== بعد از لود موفق، متغیر رو تنظیم کن =====
frame.addEventListener('load', () => {
    loaded = true;
});

// ===== شروع =====
init();
