/**
 * Language Switcher for Pan Logistics
 * Loads translations from JSON files and switches languages dynamically
 */

// Store translations in memory
let translations = {};
let currentLang = localStorage.getItem('preferredLanguage') || 'en';

/**
 * Load translation file from JSON
 * @param {string} lang - Language code (en, fr)
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }
        translations[lang] = await response.json();
        return translations[lang];
    } catch (error) {
        console.error(`Error loading ${lang} translations:`, error);
        return {};
    }
}

/**
 * Apply translations to elements with data-i18n attribute
 * @param {string} lang - Language code
 */
function applyTranslations(lang) {
    // Get translations for the language
    const langTranslations = translations[lang] || {};
    
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langTranslations[key]) {
            element.textContent = langTranslations[key];
        }
    });
    
    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (langTranslations[key]) {
            element.placeholder = langTranslations[key];
        }
    });
    
    // Update document language attribute
    document.documentElement.lang = lang;
}

/**
 * Switch to a specific language
 * @param {string} lang - Language code (en, fr)
 */
async function switchLanguage(lang) {
    // Don't do anything if language is already current
    if (lang === currentLang) return;
    
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Load translations if not already loaded
    if (!translations[lang]) {
        await loadTranslations(lang);
    }
    
    // Apply translations
    applyTranslations(lang);
    
    // Update language buttons
    updateLanguageButtons();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
}

/**
 * Update language button active states
 */
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Initialize language switcher
 */
async function initLanguageSwitcher() {
    // Load current language translations
    if (!translations[currentLang]) {
        await loadTranslations(currentLang);
    }
    
    // Apply translations
    applyTranslations(currentLang);
    
    // Set up click handlers for language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
    
    // Update button states
    updateLanguageButtons();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

// Export functions for global use
window.languageSwitcher = {
    switchLanguage,
    getCurrentLanguage: () => currentLang
};
