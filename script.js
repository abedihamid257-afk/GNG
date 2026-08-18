// ===== متغیرها =====
let currentQuery = '';

// ===== عناصر =====
const homePage = document.getElementById('homePage');
const resultsPage = document.getElementById('resultsPage');
const searchInput = document.getElementById('searchInput');
const resultsInput = document.getElementById('resultsInput');
const resultsList = document.getElementById('resultsList');
const resultsInfo = document.getElementById('resultsInfo');

// ===== جستجو =====
function doSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    currentQuery = query;
    resultsInput.value = query;
    showResults(query);
}

function doSearchFromResults() {
    const query = resultsInput.value.trim();
    if (!query) return;
    
    currentQuery = query;
    searchInput.value = query;
    showResults(query);
}

function handleEnter(event) {
    if (event.key === 'Enter') doSearch();
}

function handleEnterResults(event) {
    if (event.key === 'Enter') doSearchFromResults();
}

function feelingLucky() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    // خوش‌شانسی: مستقیم به اولین نتیجه
    window.open('https://duckduckgo.com/?q=!' + encodeURIComponent(query), '_blank');
}

function goHome() {
    homePage.style.display = 'flex';
    resultsPage.style.display = 'none';
    searchInput.focus();
}

// ===== نمایش نتایج =====
async function showResults(query) {
    homePage.style.display = 'none';
    resultsPage.style.display = 'block';
    
    resultsList.innerHTML = `
        <div class="loading">
            <div class="loader"></div>
            <p>در حال جستجوی ${query}...</p>
        </div>
    `;
    
    try {
        // استفاده از DuckDuckGo API
        const resp = await fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(query) + '&format=json&no_html=1&skip_disambig=1');
        const data = await resp.json();
        
        resultsInfo.textContent = 'نتایج جستجو برای: ' + query;
        
        let html = '';
        
        // نتایج اصلی
        if (data.Results && data.Results.length > 0) {
            data.Results.forEach(result => {
                html += `
                    <div class="result-item">
                        <a href="${result.FirstURL}" target="_blank" class="result-title">${result.Text || 'بدون عنوان'}</a>
                        <div class="result-url">${result.FirstURL}</div>
                    </div>
                `;
            });
        }
        
        // نتایج مرتبط
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            data.RelatedTopics.slice(0, 5).forEach(topic => {
                if (topic.Text && topic.FirstURL) {
                    html += `
                        <div class="result-item">
                            <a href="${topic.FirstURL}" target="_blank" class="result-title">${topic.Text}</a>
                            <div class="result-url">${topic.FirstURL}</div>
                        </div>
                    `;
                }
            });
        }
        
        // اگه نتیجه‌ای نبود
        if (!html) {
            html = `
                <div class="error-message">
                    <p>نتیجه‌ای برای "${query}" یافت نشد.</p>
                    <p style="margin-top:10px">می‌تونید عبارت دیگری را جستجو کنید.</p>
                </div>
            `;
        }
        
        resultsList.innerHTML = html;
        
    } catch(error) {
        // اگه API جواب نداد، مستقیم به DuckDuckGo لینک میدیم
        resultsList.innerHTML = `
            <div class="error-message">
                <p>مشکلی در دریافت نتایج پیش آمد.</p>
                <p style="margin-top:15px">
                    <a href="https://duckduckgo.com/?q=${encodeURIComponent(query)}" target="_blank" style="color:var(--accent)">
                        مشاهده نتایج در DuckDuckGo
                    </a>
                </p>
            </div>
        `;
    }
}

// ===== شروع =====
window.addEventListener('load', () => {
    searchInput.focus();
});
