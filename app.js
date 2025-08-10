// Jobbyist - Enhanced JavaScript with Dark Mode, User Limits & Pro Features

// Global variables
let currentPage = 1;
let totalPages = 5;
let currentStep = 1;
let jobListings = [];
let companies = [];
let filteredJobs = [];
let currentTheme = 'system';
let currentLanguage = 'en';

// User session management
let userSession = {
    isLoggedIn: false,
    isPro: false,
    dailyLimits: {
        jobViews: 0,
        jobApplications: 0,
        lastResetDate: new Date().toDateString(),
        maxJobViews: 50,
        maxJobApplications: 5
    }
};

// Language translations
const translations = {
    en: {
        heroTitle: "Your Dream Career Starts Here!",
        heroSubtitle: "Join 50,000+ professionals who've transformed their careers with Jobbyist. Stop settling for ordinary - you deserve extraordinary!",
        searchPlaceholder1: "Your dream job title...",
        searchPlaceholder2: "Where do you want to work?",
        searchButton: "Find My Dream Job"
    },
    af: {
        heroTitle: "Jou Droomloopbaan Begin Hier!",
        heroSubtitle: "Sluit by 50,000+ professionele persone aan wat hul loopbane getransformeer het met Jobbyist. Stop om tevrede te wees met gewoon - jy verdien buitengewoon!",
        searchPlaceholder1: "Jou droomwerkstitel...",
        searchPlaceholder2: "Waar wil jy werk?",
        searchButton: "Vind My Droomwerk"
    },
    zu: {
        heroTitle: "Umsebenzi Wakho Wamaphupho Uqala Lapha!",
        heroSubtitle: "Joyina ochwepheshe abayi-50,000+ abaguqule imisebenzi yabo nge-Jobbyist. Yeka ukwaneliseka okujwayelekile - ufanele okungavamile!",
        searchPlaceholder1: "Isihloko somsebenzi wamaphupho wakho...",
        searchPlaceholder2: "Kuphi lapho ufuna khona ukusebenza?",
        searchButton: "Thola Umsebenzi Wami Wamaphupho"
    }
};

// Extended job listings data (50 jobs total)
const extendedJobListings = [
    {
        "id": 1,
        "title": "Software Developer",
        "company": "Sanlam Ltd",
        "industry": "Financial Services",
        "location": "Cape Town, Western Cape",
        "category": "Information Technology",
        "employmentType": "CONTRACT",
        "salaryMin": 39449,
        "salaryMax": 51876,
        "currency": "ZAR",
        "remote": false,
        "datePosted": "2025-08-07",
        "validThrough": "2025-10-11",
        "description": "Transform the future of financial technology with South Africa's leading financial services company. Join our innovative team and build solutions that impact millions of lives.",
        "verified": true
    },
    {
        "id": 2,
        "title": "Data Scientist",
        "company": "Santam Ltd",
        "industry": "Insurance",
        "location": "Cape Town, Western Cape",
        "category": "Information Technology",
        "employmentType": "CONTRACT",
        "salaryMin": 39311,
        "salaryMax": 50906,
        "currency": "ZAR",
        "remote": true,
        "datePosted": "2025-07-23",
        "validThrough": "2025-09-21",
        "description": "Unlock the power of data and drive business transformation at one of South Africa's most trusted insurance companies. Your insights will shape the future of risk management.",
        "verified": true
    }
];

// Company data with enhanced reviews
const companiesData = [
    {
        "id": 1,
        "name": "Vodacom Group",
        "industry": "Telecommunications",
        "location": "Midrand, Gauteng",
        "description": "Leading telecommunications company connecting South Africa to the world with innovative solutions and cutting-edge technology.",
        "rating": 4.5,
        "employees": "8000+",
        "verified": true,
        "reviews": [
            { "rating": 5, "comment": "Incredible work-life balance and amazing benefits package!" },
            { "rating": 4, "comment": "Innovation-driven company with fantastic growth opportunities" },
            { "rating": 5, "comment": "Best decision I ever made joining this success-focused team" }
        ]
    },
    {
        "id": 2,
        "name": "HCL Technologies SA",
        "industry": "Information Technology",
        "location": "Johannesburg, Gauteng",
        "description": "Global technology powerhouse driving digital transformation and career acceleration across Africa.",
        "rating": 4.3,
        "employees": "5000+",
        "verified": true,
        "reviews": [
            { "rating": 4, "comment": "Outstanding learning opportunities and diverse challenging projects" },
            { "rating": 4, "comment": "Supportive leadership team that truly invests in your success" }
        ]
    }
];

// Initialize the application when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeTheme();
    resetDailyLimits();
    loadUserSession();
    setupEventListeners();
    generateJobListings();
    loadJobListings();
    loadCompanies();
    initializeCharts();
    updateUserLimitsDisplay();
    
    // CRITICAL: DO NOT show registration modal on page load
    console.log('App initialized - registration modal remains hidden until user action');
});

// Initialize application
function initializeApp() {
    showPage('home');
    updateNavigation();
    updatePaginationInfo();
    
    // Load language preference
    const savedLanguage = localStorage.getItem('jobbyist_language') || 'en';
    changeLanguage(savedLanguage);
}

// Theme Management System
function initializeTheme() {
    const savedTheme = localStorage.getItem('jobbyist_theme') || 'system';
    applyTheme(savedTheme);
}

function toggleTheme() {
    let newTheme;
    switch(currentTheme) {
        case 'light':
            newTheme = 'dark';
            break;
        case 'dark':
            newTheme = 'system';
            break;
        default:
            newTheme = 'light';
    }
    applyTheme(newTheme);
}

function applyTheme(theme) {
    currentTheme = theme;
    const body = document.body;
    
    // Remove existing theme classes
    body.removeAttribute('data-theme');
    
    if (theme === 'system') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
        }
    } else {
        body.setAttribute('data-theme', theme);
    }
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' || 
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
            ? 'â˜€ï¸' : 'ðŸŒ™';
    }
    
    localStorage.setItem('jobbyist_theme', theme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme === 'system') {
        applyTheme('system');
    }
});

// Language Management
function toggleLanguageMenu() {
    const menu = document.querySelector('.language-menu');
    menu.classList.toggle('hidden');
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('jobbyist_language', lang);
    
    // Update language button
    const langBtn = document.querySelector('.language-btn span');
    const langMap = { 'en': 'EN', 'af': 'AF', 'zu': 'ZU' };
    if (langBtn) langBtn.textContent = langMap[lang];
    
    // Update UI text
    updateUILanguage();
    
    // Hide language menu
    document.querySelector('.language-menu').classList.add('hidden');
}

function updateUILanguage() {
    const t = translations[currentLanguage];
    
    // Update hero section
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const searchBtn = document.querySelector('.search__btn');
    const keywordInput = document.getElementById('jobKeyword');
    const locationInput = document.getElementById('jobLocation');
    
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
    if (searchBtn) searchBtn.textContent = t.searchButton;
    if (keywordInput) keywordInput.placeholder = t.searchPlaceholder1;
    if (locationInput) locationInput.placeholder = t.searchPlaceholder2;
}

// User Session & Limits Management
function loadUserSession() {
    const saved = localStorage.getItem('jobbyist_session');
    if (saved) {
        userSession = { ...userSession, ...JSON.parse(saved) };
    }
    updateUserLimitsDisplay();
}

function saveUserSession() {
    localStorage.setItem('jobbyist_session', JSON.stringify(userSession));
}

function resetDailyLimits() {
    const today = new Date().toDateString();
    if (userSession.dailyLimits.lastResetDate !== today) {
        userSession.dailyLimits.jobViews = 0;
        userSession.dailyLimits.jobApplications = 0;
        userSession.dailyLimits.lastResetDate = today;
        saveUserSession();
    }
}

function updateUserLimitsDisplay() {
    const viewsCount = document.getElementById('jobViewsCount');
    const appsCount = document.getElementById('applicationsCount');
    const viewedJobsCount = document.getElementById('viewedJobsCount');
    
    if (viewsCount) viewsCount.textContent = userSession.dailyLimits.jobViews;
    if (appsCount) appsCount.textContent = userSession.dailyLimits.jobApplications;
    if (viewedJobsCount) viewedJobsCount.textContent = userSession.dailyLimits.jobViews;
    
    // Show warning if approaching limits
    if (!userSession.isPro && userSession.dailyLimits.jobViews >= 40) {
        showJobLimitWarning();
    }
}

function showJobLimitWarning() {
    const warning = document.getElementById('jobLimitWarning');
    if (warning) {
        warning.classList.remove('hidden');
    }
}

function checkJobViewLimit() {
    if (!userSession.isPro && userSession.dailyLimits.jobViews >= userSession.dailyLimits.maxJobViews) {
        showUpgradeModal();
        return false;
    }
    
    userSession.dailyLimits.jobViews++;
    saveUserSession();
    updateUserLimitsDisplay();
    return true;
}

function checkApplicationLimit() {
    if (!userSession.isPro && userSession.dailyLimits.jobApplications >= userSession.dailyLimits.maxJobApplications) {
        showUpgradeModal();
        return false;
    }
    
    userSession.dailyLimits.jobApplications++;
    saveUserSession();
    updateUserLimitsDisplay();
    return true;
}

function showLimitsNotification() {
    document.getElementById('limitsNotification').classList.remove('hidden');
}

function closeLimitsNotification() {
    document.getElementById('limitsNotification').classList.add('hidden');
}

// Chat Widget Implementation
function openChatWidget() {
    // This is where you would implement the OpenAI chatbot
    // For now, show a placeholder
    showChatModal();
}

function showChatModal() {
    alert(`ðŸš€ AI Career Assistant Coming Soon!\n\nWe're building an intelligent chatbot powered by OpenAI GPT-5 mini to help with:\n\nâœ… Job search guidance\nâœ… Career advice\nâœ… Interview preparation\nâœ… Resume tips\n\nImplementation Guide:\n1. Get OpenAI API key from platform.openai.com\n2. Set up webhook endpoint for chat messages\n3. Configure GPT-5 mini model with job context\n4. Add conversation history management\n\nStay tuned for this game-changing feature!`);
}

// Generate extended job listings
function generateJobListings() {
    const companies = [
        "Pick n Pay", "MTN Group", "Sasol", "Anglo American", "Bidvest Group",
        "FirstRand", "Woolworths", "Discovery", "Naspers", "Telkom",
        "Old Mutual", "Tiger Brands", "Clicks Group", "Mr Price Group",
        "Capitec Bank", "Massmart", "Steinhoff", "Barloworld", "Investec",
        "RMB Holdings", "Nedbank", "ABSA", "Liberty Holdings", "Momentum Metropolitan"
    ];

    const jobTitles = [
        "Senior Developer", "Product Manager", "UX Designer", "Business Analyst",
        "Project Manager", "DevOps Engineer", "QA Specialist", "Sales Champion",
        "Account Success Manager", "HR Business Partner", "Finance Director", "Operations Excellence Manager",
        "Customer Success Hero", "Marketing Growth Specialist", "Content Creator", "Senior Accountant",
        "Legal Advisor", "IT Support Specialist", "Network Engineer", "Database Administrator",
        "Security Analyst", "Training Manager", "Procurement Officer", "Risk Manager"
    ];

    const locations = [
        "Cape Town, Western Cape", "Johannesburg, Gauteng", "Durban, KwaZulu-Natal",
        "Pretoria, Gauteng", "Port Elizabeth, Eastern Cape", "Bloemfontein, Free State",
        "East London, Eastern Cape", "Pietermaritzburg, KwaZulu-Natal", "Kimberley, Northern Cape",
        "Polokwane, Limpopo", "Nelspruit, Mpumalanga", "Mahikeng, North West"
    ];

    const categories = [
        "Information Technology", "Finance & Accounting", "Sales & Marketing",
        "Healthcare", "Engineering", "Education", "Legal", "Human Resources",
        "Operations", "Customer Service", "Administration", "Consulting"
    ];

    const employmentTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"];
    const motivationalDescriptions = [
        "Transform your career with this incredible opportunity!",
        "Join a team that's changing the game in South African business!",
        "Your next breakthrough awaits with this amazing role!",
        "Unlock your potential with industry leaders who invest in success!",
        "Be part of something extraordinary - your dream job is here!"
    ];

    const generatedJobs = [...extendedJobListings];

    for (let i = 3; i <= 50; i++) {
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
        const randomDescription = motivationalDescriptions[Math.floor(Math.random() * motivationalDescriptions.length)];
        const isRemote = Math.random() < 0.47;

        const baseSalary = Math.floor(Math.random() * 40000) + 25000;
        const salaryRange = Math.floor(Math.random() * 20000) + 10000;

        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const datePosted = new Date();
        datePosted.setDate(datePosted.getDate() - daysAgo);
        
        const validThrough = new Date(datePosted);
        validThrough.setDate(validThrough.getDate() + 60);

        generatedJobs.push({
            id: i,
            title: randomTitle,
            company: randomCompany,
            industry: "Various",
            location: randomLocation,
            category: randomCategory,
            employmentType: randomType,
            salaryMin: baseSalary,
            salaryMax: baseSalary + salaryRange,
            currency: "ZAR",
            remote: isRemote,
            datePosted: datePosted.toISOString().split('T')[0],
            validThrough: validThrough.toISOString().split('T')[0],
            description: randomDescription,
            verified: Math.random() < 0.8
        });
    }

    jobListings = generatedJobs;
    filteredJobs = [...jobListings];
}

// Setup event listeners
function setupEventListeners() {
    // Category card clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterJobsByCategory(category);
            showPage('jobs');
        });
    });

    // Filter change events
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    document.getElementById('locationFilter')?.addEventListener('change', applyFilters);
    document.getElementById('typeFilter')?.addEventListener('change', applyFilters);
    document.getElementById('remoteFilter')?.addEventListener('change', applyFilters);

    // Navigation link handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav__link:not([target="_blank"])')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href?.startsWith('#')) {
                const pageId = href.substring(1);
                showPage(pageId);
            }
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            document.querySelector('.language-menu')?.classList.add('hidden');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
            document.querySelector('.language-menu')?.classList.add('hidden');
        }
    });
}

// Navigation functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId)?.classList.add('active');
    updateNavigation(pageId);
    window.scrollTo(0, 0);
}

function updateNavigation(activePage = 'home') {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${activePage}`) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    // Mobile menu implementation
    const menu = document.querySelector('.nav__menu');
    menu?.classList.toggle('mobile-active');
}

// Search functionality
function searchJobs(event) {
    event.preventDefault();
    const keyword = document.getElementById('jobKeyword')?.value.toLowerCase() || '';
    const location = document.getElementById('jobLocation')?.value.toLowerCase() || '';
    
    filteredJobs = jobListings.filter(job => {
        const matchesKeyword = !keyword || 
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword) ||
            job.category.toLowerCase().includes(keyword);
        
        const matchesLocation = !location ||
            job.location.toLowerCase().includes(location);
        
        return matchesKeyword && matchesLocation;
    });
    
    currentPage = 1;
    loadJobListings();
    showPage('jobs');
}

function filterJobsByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    applyFilters();
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const remoteFilter = document.getElementById('remoteFilter')?.checked || false;
    
    filteredJobs = jobListings.filter(job => {
        const matchesCategory = !categoryFilter || job.category === categoryFilter;
        const matchesLocation = !locationFilter || job.location.includes(locationFilter);
        const matchesType = !typeFilter || job.employmentType === typeFilter;
        const matchesRemote = !remoteFilter || job.remote;
        
        return matchesCategory && matchesLocation && matchesType && matchesRemote;
    });
    
    currentPage = 1;
    totalPages = Math.ceil(filteredJobs.length / 10);
    loadJobListings();
    updatePaginationInfo();
}

// Job listing functions
function loadJobListings() {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;
    
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);
    
    jobsGrid.innerHTML = '';
    
    jobsToShow.forEach((job, index) => {
        const jobCard = createJobCard(job);
        jobsGrid.appendChild(jobCard);
        
        // Add ad every 3rd job
        if ((index + 1) % 3 === 0 && !userSession.isPro) {
            const adPlaceholder = createAdPlaceholder();
            jobsGrid.appendChild(adPlaceholder);
        }
    });
    
    updatePaginationInfo();
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    const timeAgo = getTimeAgo(job.datePosted);
    const salaryRange = `R${job.salaryMin.toLocaleString()} - R${job.salaryMax.toLocaleString()}`;
    
    card.innerHTML = `
        <div class="job-card__header">
            <div>
                <h3 class="job-card__title">${job.title}</h3>
                <div class="job-card__company">${job.company}${job.verified ? ' âœ“' : ''}</div>
                <div class="job-card__location">${job.location}</div>
            </div>
            <div class="job-card__salary">${salaryRange}</div>
        </div>
        <div class="job-card__meta">
            <span class="job-card__tag">${job.employmentType.replace('_', '-').toLowerCase()}</span>
            <span class="job-card__tag">${job.category}</span>
            ${job.remote ? '<span class="job-card__tag job-card__tag--remote">Remote Freedom</span>' : ''}
            <span class="job-card__tag">${timeAgo}</span>
        </div>
        <div class="job-card__description">
            <p>${job.description}</p>
        </div>
        <div class="job-card__actions">
            <button class="btn btn--secondary btn--sm" onclick="saveJob(${job.id})">Save for Later</button>
            <button class="btn btn--primary btn--sm" onclick="applyToJob(${job.id})">Apply Now</button>
        </div>
    `;
    
    return card;
}

function createAdPlaceholder() {
    const ad = document.createElement('div');
    ad.className = 'ad-container ad-between-jobs';
    ad.innerHTML = `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX"></script>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXX"
             data-ad-slot="XXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    `;
    return ad;
}

function getTimeAgo(datePosted) {
    const now = new Date();
    const posted = new Date(datePosted);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Job interaction functions
function saveJob(jobId) {
    // Show registration modal for this premium action
    openRegistrationModal('signup');
}

function applyToJob(jobId) {
    if (!checkApplicationLimit()) return;
    
    // Show registration modal for job application
    openRegistrationModal('signup');
}

function viewJobDetails(jobId) {
    if (!checkJobViewLimit()) return;
    
    // Show job details or registration modal
    openRegistrationModal('signup');
}

// Company functions
function loadCompanies() {
    const companiesGrid = document.getElementById('companiesGrid');
    if (!companiesGrid) return;
    
    companiesGrid.innerHTML = '';
    companies = companiesData;
    
    companies.forEach(company => {
        const companyCard = createCompanyCard(company);
        companiesGrid.appendChild(companyCard);
    });
}

function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';
    
    const stars = 'â˜…'.repeat(Math.floor(company.rating)) + 'â˜†'.repeat(5 - Math.floor(company.rating));
    
    card.innerHTML = `
        <div class="company-card__header">
            <div>
                <h3 class="company-card__name">${company.name}</h3>
                <div class="company-card__industry">${company.industry}</div>
                <div class="company-card__location">${company.location}</div>
            </div>
            <div class="verified-badge">Verified âœ“</div>
        </div>
        <div class="company-card__rating">
            <span class="stars">${stars}</span>
            <span>(${company.rating})</span>
        </div>
        <div class="company-card__employees">${company.employees} success stories</div>
        <div class="company-card__description">
            <p>${company.description}</p>
        </div>
        <div class="company-card__actions">
            <button class="btn btn--secondary btn--sm pro-only-feature" onclick="followCompany(${company.id})">Follow Company</button>
            <button class="btn btn--primary btn--sm" onclick="viewCompanyProfile(${company.id})">View Profile</button>
        </div>
    `;
    
    return card;
}

function followCompany(companyId) {
    if (!userSession.isPro) {
        showProFeatureModal('follow-company');
        return;
    }
    
    // Pro user functionality
    alert('ðŸŽ‰ You are now following this company! You\'ll get notified of new opportunities.');
}

function viewCompanyProfile(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        showCompanyModal(company);
    }
}

function showCompanyModal(company) {
    const modal = document.getElementById('companyModal');
    const content = document.getElementById('companyModalContent');
    
    const stars = 'â˜…'.repeat(Math.floor(company.rating)) + 'â˜†'.repeat(5 - Math.floor(company.rating));
    const jobCount = jobListings.filter(job => job.company === company.name).length;
    
    const reviewsHTML = company.reviews.map(review => `
        <div class="review">
            <div class="review__rating">${'â˜…'.repeat(review.rating)}${'â˜†'.repeat(5-review.rating)}</div>
            <p class="review__comment">"${review.comment}"</p>
        </div>
    `).join('');
    
    content.innerHTML = `
        <div class="company-profile">
            <div class="company-profile__header">
                <h2>${company.name}</h2>
                <div class="verified-badge">Verified âœ“</div>
            </div>
            <div class="company-profile__info">
                <p><strong>Industry:</strong> ${company.industry}</p>
                <p><strong>Location:</strong> ${company.location}</p>
                <p><strong>Team Size:</strong> ${company.employees}</p>
                <div class="company-profile__rating">
                    <span class="stars">${stars}</span>
                    <span>(${company.rating} out of 5 - Exceptional workplace!)</span>
                </div>
            </div>
            <div class="company-profile__description">
                <h4>About ${company.name}</h4>
                <p>${company.description}</p>
            </div>
            <div class="company-profile__jobs">
                <h4>Current Success Opportunities</h4>
                <p>${jobCount} career-changing positions available now!</p>
            </div>
            <div class="company-profile__reviews">
                <h4>Success Stories from Team Members</h4>
                ${!userSession.isPro ? '<p class="pro-notice">ðŸŒŸ <strong>Pro members get full access to employee reviews!</strong> <button class="btn btn--primary btn--sm" onclick="showUpgradeModal()">Upgrade Now</button></p>' : reviewsHTML}
            </div>
            <div class="company-profile__actions">
                <button class="btn btn--primary" onclick="followCompany(${company.id})">${userSession.isPro ? 'Follow Company' : 'Follow (Pro Feature)'}</button>
                <button class="btn btn--secondary" onclick="closeCompanyModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeCompanyModal() {
    document.getElementById('companyModal')?.classList.add('hidden');
}

// Modal Management - CRITICAL: Only show when triggered by user actions
function openRegistrationModal(type = 'signup') {
    const modal = document.getElementById('registrationModal');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const progressContainer = document.getElementById('progressContainer');
    const progressText = document.getElementById('progressText');
    
    // Reset modal state
    currentStep = 1;
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        registrationForm.style.display = 'none';
        progressContainer.style.display = 'none';
        progressText.style.display = 'none';
        document.getElementById('modalTitle').textContent = 'Welcome Back, Champion!';
    } else {
        loginForm.style.display = 'none';
        registrationForm.style.display = 'block';
        progressContainer.style.display = 'block';
        progressText.style.display = 'block';
        updateRegistrationModal();
    }
    
    modal.classList.remove('hidden');
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    modal.classList.add('hidden');
    document.getElementById('registrationForm')?.reset();
    document.getElementById('loginForm')?.reset();
    currentStep = 1;
}

function switchToSignup() {
    openRegistrationModal('signup');
}

function switchToLogin() {
    openRegistrationModal('login');
}

function updateRegistrationModal() {
    // Ensure step is within bounds
    if (currentStep < 1) currentStep = 1;
    if (currentStep > 5) currentStep = 5;
    
    // Update progress
    const progressPercentage = (currentStep / 5) * 100;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;
    document.getElementById('currentStep').textContent = currentStep;
    document.getElementById('progressPercent').textContent = `${Math.round(progressPercentage)}%`;
    
    // Show/hide form steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    currentStepElement?.classList.add('active');
    
    // Update buttons
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.textContent = currentStep === 5 ? 'Launch My Success Story!' : 'Next Step to Success';
    
    // Update modal title
    const titles = [
        'Let\'s Build Your Success Foundation',
        'Define Your Professional Power',
        'Design Your Success Path',
        'Showcase Your Superpowers',
        'Complete Your Success Profile'
    ];
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle && titles[currentStep - 1]) {
        modalTitle.textContent = titles[currentStep - 1];
    }
}

function handleRegistrationStep(event) {
    event.preventDefault();
    
    if (currentStep < 5) {
        nextStep();
    } else {
        completeRegistration();
    }
}

function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateRegistrationModal();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateRegistrationModal();
    }
}

function completeRegistration() {
    // Mark user as logged in and save session
    userSession.isLoggedIn = true;
    saveUserSession();
    
    // Show success message
    alert('ðŸŽ‰ INCREDIBLE! Your success journey starts now!\n\nWelcome to the Jobbyist community of champions. Your profile is ready, and amazing opportunities are already being matched to your goals!\n\nâœ¨ Check your email for next steps\nðŸš€ Start exploring unlimited possibilities');
    
    closeRegistrationModal();
    showLimitsNotification();
}

// Pro Feature Modals
function showProFeatureModal(feature) {
    const modal = document.getElementById('proFeatureModal');
    modal.classList.remove('hidden');
}

function closeProFeatureModal() {
    document.getElementById('proFeatureModal')?.classList.add('hidden');
}

function showUpgradeModal() {
    showProFeatureModal('upgrade');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Pagination functions
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadJobListings();
    }
}

function updatePaginationInfo() {
    totalPages = Math.ceil(filteredJobs.length / 10);
    const paginationInfo = document.getElementById('paginationInfo');
    if (paginationInfo) {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// Charts for JobStats
function initializeCharts() {
    // Categories chart
    const categoriesCtx = document.getElementById('categoriesChart');
    if (categoriesCtx) {
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Information Technology', 'Sales & Marketing', 'Finance & Accounting', 'Healthcare', 'Engineering'],
                datasets: [{
                    data: [8450, 5230, 3890, 2340, 2180],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Where Dreams Become Reality'
                    }
                }
            }
        });
    }
    
    // Salaries chart
    const salariesCtx = document.getElementById('salariesChart');
    if (salariesCtx) {
        new Chart(salariesCtx, {
            type: 'bar',
            data: {
                labels: ['IT', 'Engineering', 'Finance', 'Healthcare', 'Sales'],
                datasets: [{
                    label: 'Average Success Salary (ZAR)',
                    data: [52000, 55000, 45000, 38000, 35000],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Your Earning Power Awaits'
                    }
                }
            }
        });
    }
}

// Legal pages (enhanced)
function showLegalPage(page) {
    const titles = {
        'terms': 'ðŸ“‹ Terms of Success',
        'privacy': 'ðŸ”’ Privacy Protection Policy', 
        'cookies': 'ðŸª Cookie Preferences',
        'contact': 'ðŸ“ž Connect With Our Success Team'
    };
    
    const content = {
        'terms': 'Our comprehensive Terms of Service ensure your success journey is protected and empowering...',
        'privacy': 'Your privacy and data security are paramount to us. We protect your information like our own...',
        'cookies': 'We use cookies to enhance your experience and match you with perfect opportunities...',
        'contact': 'ðŸš€ Ready to accelerate your success?\n\nðŸ“§ Email: success@jobbyist.co.za\nðŸ“± WhatsApp: +27 11 123 4567\nðŸ’¬ Live Chat: Available 24/7\n\nOur success team is here to help you achieve your career dreams!'
    };
    
    alert(`${titles[page]}\n\n${content[page]}`);
}

/*
===========================================
OpenAI ChatBot Integration Implementation Guide
===========================================

To integrate the OpenAI GPT-5 mini chatbot:

1. **API Setup**:
   - Sign up at https://platform.openai.com/
   - Generate API key from your dashboard
   - Add billing information for usage

2. **Backend Endpoint** (implement on your server):
   ```javascript
   // Example Node.js endpoint
   app.post('/api/chat', async (req, res) => {
       const { message, context } = req.body;
       
       const response = await openai.chat.completions.create({
           model: "gpt-4o-mini", // Use GPT-4o mini (latest model)
           messages: [
               {
                   role: "system",
                   content: `You are a helpful career assistant for Jobbyist, a South African job platform. 
                            Help users with job searching, career advice, and interview preparation. 
                            Be motivational and encouraging. Context: ${context}`
               },
               {
                   role: "user", 
                   content: message
               }
           ],
           max_tokens: 150,
           temperature: 0.7
       });
       
       res.json({ reply: response.choices[0].message.content });
   });
   ```

3. **Frontend Integration**:
   Update the openChatWidget() function:
   ```javascript
   async function openChatWidget() {
       // Create chat interface
       const chatHTML = `
           <div id="chatModal" class="modal">
               <div class="modal__content">
                   <div id="chatMessages"></div>
                   <input type="text" id="chatInput" placeholder="Ask me about jobs...">
                   <button onclick="sendChatMessage()">Send</button>
               </div>
           </div>
       `;
       document.body.insertAdjacentHTML('beforeend', chatHTML);
   }
   
   async function sendChatMessage() {
       const input = document.getElementById('chatInput');
       const message = input.value;
       
       const response = await fetch('/api/chat', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
               message, 
               context: `Available jobs: ${jobListings.length}, User location: ${userLocation}` 
           })
       });
       
       const data = await response.json();
       displayChatMessage('bot', data.reply);
   }
   ```

4. **GitHub Pages Limitation**:
   Since GitHub Pages only serves static files, you'll need:
   - Deploy backend to Vercel, Netlify Functions, or similar
   - Use CORS-enabled API endpoints
   - Implement client-side API key management (less secure)

5. **Production Setup**:
   - Store API key in environment variables
   - Implement rate limiting
   - Add conversation history storage
   - Create context about available jobs for better responses
   - Add typing indicators and better UX

6. **Security Considerations**:
   - Never expose API keys in frontend code
   - Implement user session management
   - Add input sanitization
   - Monitor API usage and costs

For GitHub Pages deployment, consider using a serverless function provider
or implement a simple proxy server for the OpenAI API calls.
*/

// Initialize Google AdSense (placeholder implementation)
function initializeAds() {
    // This would initialize AdSense when you have a publisher ID
    console.log('AdSense integration ready - replace ca-pub-XXXXXXXXX with your publisher ID');
}

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        userSession,
        applyTheme,
        changeLanguage,
        checkJobViewLimit,
        checkApplicationLimit
    };
}