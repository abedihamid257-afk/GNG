// =============================================
// GNG Search - موتور جستجو
// استفاده از DuckDuckGo API (رایگان و بدون کلید)
// =============================================

'use strict';

// ===== عناصر DOM =====
const homePage = document.getElementById('homePage');
const resultsPage = document.getElementById('resultsPage');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsInput = document.getElementById('resultsInput');
const resultsList = document.getElementById('resultsList');
const resultsInfo = document.getElementById('resultsInfo');
const clearBtn = document.getElementById('clearBtn');
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// ===== متغیرها =====
let currentQuery = '';
let currentPage = 0;
let allResults = [];
const RESULTS_PER_PAGE = 5;
let isDark = false;

// =============================================
// توابع کمکی
// =============================================

// جلوگیری از XSS
function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// =============================================
// مدیریت تم
// =============================================
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('gng_theme', isDark ? 'dark' : 'light');
}

// لود تم ذخیره شده
function loadTheme() {
    const saved = localStorage.getItem('gng_theme');
    if (saved === 'dark') {
        isDark = true;
        document.body.classList.add('dark');
    }
}

// =============================================
// مدیریت جستجو
// =============================================
function handleSearch(event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        performSearch(query);
    }
}

function handleResultsSearch(event) {
    event.preventDefault();
    const query = resultsInput.value.trim();
    if (query) {
        performSearch(query);
    }
}

function performSearch(query) {
    currentQuery = sanitize(query);
    currentPage = 0;
    searchInput.value = query;
    resultsInput.value = query;
    
    // نمایش صفحه نتایج
    homePage.style.display = 'none';
    resultsPage.style.display = 'block';
    
    // نمایش لودینگ
    resultsList.innerHTML = `
        <div class="loading">
            <div class="loader"></div>
            <p class="loading-text">در حال جستجوی "${sanitize(query)}"...</p>
        </div>
    `;
    resultsInfo.textContent = '';
    pagination.style.display = 'none';
    
    // انجام جستجو
    fetchResults(query);
}

async function fetchResults(query) {
    try {
        const apiUrl = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(query) + '&format=json&no_html=1';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 ثانیه
        
        const resp = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!resp.ok) throw new Error('Status: ' + resp.status);
        
        const data = await resp.json();
        
        // جمع‌آوری نتایج
        allResults = [];
        
        if (data.Results && data.Results.length > 0) {
            data.Results.forEach(r => {
                allResults.push({
                    title: r.Text || 'بدون عنوان',
                    url: r.FirstURL || '',
                    desc: 'نتیجه از دانش‌نامه'
                });
            });
        }
        
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            data.RelatedTopics.slice(0, 10).forEach(t => {
                if (t.Text && t.FirstURL) {
                    allResults.push({
                        title: t.Text,
                        url: t.FirstURL,
                        desc: 'موضوع مرتبط'
                    });
                }
            });
        }
        
        displayResults();
        
    } catch (error) {
        console.error('Search error:', error.message);
        
        // نمایش پیام خطا با لینک مستقیم
        resultsList.innerHTML = `
            <div class="error-message">
                <div class="error-icon">🔍</div>
                <h3>مشکلی در جستجو پیش آمد</h3>
                <p style="margin:10px 0">${sanitize(error.message)}</p>
                <a href="https://duckduckgo.com/?q=${encodeURIComponent(currentQuery)}" 
                   target="_blank" 
                   style="color:var(--accent); text-decoration:underline;">
                    مشاهده نتایج مستقیم
                </a>
            </div>
        `;
        resultsInfo.textContent = '';
        pagination.style.display = 'none';
    }
}

// =============================================
// نمایش نتایج
// =============================================
function displayResults() {
    if (allResults.length === 0) {
        resultsList.innerHTML = `
            <div class="error-message">
                <div class="error-icon">📭</div>
                <h3>نتیجه‌ای یافت نشد</h3>
                <p style="margin:10px 0">برای "${sanitize(currentQuery)}" نتیجه‌ای پیدا نکردیم.</p>
                <p>عبارت دیگری را امتحان کنید.</p>
            </div>
        `;
        resultsInfo.textContent = '';
        pagination.style.display = 'none';
        return;
    }
    
    // محاسبه صفحات
    const totalPages = Math.ceil(allResults.length / RESULTS_PER_PAGE);
    const start = currentPage * RESULTS_PER_PAGE;
    const end = Math.min(start + RESULTS_PER_PAGE, allResults.length);
    const pageResults = allResults.slice(start, end);
    
    // نمایش تعداد نتایج
    resultsInfo.textContent = `${allResults.length} نتیجه برای "${currentQuery}" یافت شد`;
    
    // ساخت HTML نتایج
    let html = '';
    pageResults.forEach((result, index) => {
        html += `
            <article class="result-item" tabindex="0">
                <a href="${sanitize(result.url)}" target="_blank" rel="noopener noreferrer" class="result-title">
                    ${sanitize(result.title)}
                </a>
                <div class="result-url">${sanitize(result.url)}</div>
                <p class="result-desc">${sanitize(result.desc)}</p>
            </article>
        `;
    });
    
    resultsList.innerHTML = html;
    
    // نمایش صفحه‌بندی اگه بیشتر از یک صفحه باشه
    if (totalPages > 1) {
        pagination.style.display = 'flex';
        prevPageBtn.disabled = currentPage === 0;
        nextPageBtn.disabled = currentPage >= totalPages - 1;
        pageInfo.textContent = `صفحه ${currentPage + 1} از ${totalPages}`;
    } else {
        pagination.style.display = 'none';
    }
}

// =============================================
// صفحه‌بندی
// =============================================
function changePage(direction) {
    const totalPages = Math.ceil(allResults.length / RESULTS_PER_PAGE);
    const newPage = currentPage + direction;
    
    if (newPage >= 0 && newPage < totalPages) {
        currentPage = newPage;
        displayResults();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// =============================================
// سایر توابع
// =============================================
function goHome(event) {
    event.preventDefault();
    homePage.style.display = 'flex';
    resultsPage.style.display = 'none';
    searchInput.focus();
}

function clearSearch() {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
}

function feelingLucky() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    // خوش‌شانسی: رفتن به اولین نتیجه جستجو
    window.open('https://duckduckgo.com/?q=!' + encodeURIComponent(query), '_blank');
}

// نمایش/مخفی کردن دکمه پاک کردن
searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'flex' : 'none';
});

// =============================================
// راه‌اندازی
// =============================================
window.addEventListener('load', () => {
    loadTheme();
    searchInput.focus();
});

// پشتیبانی از کلید / برای فوکوس
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        searchInput.focus();
    }
});
