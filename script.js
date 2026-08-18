// ===== عناصر =====
const frame = document.getElementById('browserFrame');
const urlInput = document.getElementById('urlInput');
let historyStack = [];
let historyIndex = -1;

// ===== تابع ناوبری =====
function navigate() {
    let url = urlInput.value.trim();
    
    if (!url) return;
    
    // اگه آدرس کامل نبود، https:// اضافه کن
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // اگه شبیه آدرس بود
        if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url;
        } else {
            // جستجو در گوگل
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        }
    }
    
    frame.src = url;
    urlInput.value = url;
    
    // اضافه به تاریخچه
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(url);
    historyIndex = historyStack.length - 1;
}

// ===== دکمه Enter =====
function handleEnter(event) {
    if (event.key === 'Enter') {
        navigate();
    }
}

// ===== باز کردن سایت سریع =====
function openSite(url) {
    frame.src = url;
    urlInput.value = url;
    
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(url);
    historyIndex = historyStack.length - 1;
}

// ===== دکمه برگشت =====
function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        frame.src = historyStack[historyIndex];
        urlInput.value = historyStack[historyIndex];
    }
}

// ===== دکمه جلو =====
function goForward() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        frame.src = historyStack[historyIndex];
        urlInput.value = historyStack[historyIndex];
    }
}

// ===== رفرش =====
function refreshPage() {
    frame.src = frame.src;
}

// ===== لود اولیه =====
window.addEventListener('load', () => {
    urlInput.value = 'https://www.google.com';
});
