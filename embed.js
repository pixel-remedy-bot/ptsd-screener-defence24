/**
 * PTSD Screener Embed Script for Defence24.pl
 * 
 * Usage:
 * <script src="https://your-domain.com/ptsd-screener/embed.js" 
 *         data-theme="auto|light|dark"
 *         data-position="after-article"
 *         async></script>
 * 
 * Or manually init:
 * PTSDScreenerEmbed.init({
 *   theme: 'auto',
 *   position: 'after-article'
 * });
 */

(function() {
    'use strict';

    const CONFIG = {
        baseUrl: '',
        defaultTheme: 'auto',
        containerId: 'ptsd-screener-banner'
    };

    // Styles injected for the banner
    const BANNER_STYLES = `
        #ptsd-screener-banner {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 24px 0;
            max-width: 100%;
        }
        
        .ptsd-banner {
            background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
            border: 1px solid #d0d7e0;
            border-radius: 12px;
            padding: 20px 24px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            position: relative;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .ptsd-banner::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #46b7c6;
            border-radius: 12px 0 0 12px;
        }
        
        .ptsd-banner-content {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
            min-width: 200px;
        }
        
        .ptsd-banner-icon {
            width: 48px;
            height: 48px;
            background: rgba(70, 183, 198, 0.15);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #46b7c6;
            flex-shrink: 0;
        }
        
        .ptsd-banner-icon svg {
            width: 24px;
            height: 24px;
        }
        
        .ptsd-banner-text h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1a1d23;
            margin: 0 0 4px 0;
            line-height: 1.3;
        }
        
        .ptsd-banner-text p {
            font-size: 14px;
            color: #5a6573;
            margin: 0;
        }
        
        .ptsd-banner-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            background: #46b7c6;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }
        
        .ptsd-banner-btn:hover {
            background: #3aa3b1;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(70, 183, 198, 0.3);
        }
        
        .ptsd-banner-disclaimer {
            position: absolute;
            bottom: 6px;
            right: 12px;
            font-size: 10px;
            color: #8a94a3;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Dark mode */
        [data-ptsd-theme="dark"] .ptsd-banner {
            background: linear-gradient(135deg, #232830 0%, #1a1d23 100%);
            border-color: #3d4550;
        }
        
        [data-ptsd-theme="dark"] .ptsd-banner-text h2 {
            color: #f0f2f5;
        }
        
        [data-ptsd-theme="dark"] .ptsd-banner-text p {
            color: #b4bcc7;
        }
        
        /* Auto theme - dark mode */
        @media (prefers-color-scheme: dark) {
            [data-ptsd-theme="auto"] .ptsd-banner {
                background: linear-gradient(135deg, #232830 0%, #1a1d23 100%);
                border-color: #3d4550;
            }
            [data-ptsd-theme="auto"] .ptsd-banner-text h2 {
                color: #f0f2f5;
            }
            [data-ptsd-theme="auto"] .ptsd-banner-text p {
                color: #b4bcc7;
            }
        }
        
        @media (max-width: 480px) {
            .ptsd-banner {
                padding: 16px;
                flex-direction: column;
                align-items: flex-start;
            }
            
            .ptsd-banner-content {
                width: 100%;
            }
            
            .ptsd-banner-btn {
                width: 100%;
            }
        }
    `;

    // Modal styles (injected when opened)
    const MODAL_HTML = `
        <div id="ptsd-modal" class="ptsd-modal">
            <div class="ptsd-modal-overlay"></div>
            <div class="ptsd-modal-content">
                <iframe id="ptsd-iframe" src="" frameborder="0" allow="autoplay; fullscreen" 
                        style="width: 100%; height: 100%; border: none; border-radius: 16px;"></iframe>
                <button id="ptsd-modal-close" class="ptsd-modal-close" aria-label="Zamknij">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>
        </div>
    `;

    const MODAL_STYLES = `
        .ptsd-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }
        
        .ptsd-modal.active {
            display: flex;
        }
        
        .ptsd-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        
        .ptsd-modal-content {
            position: relative;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            width: 100%;
            max-width: 600px;
            height: 80vh;
            max-height: 700px;
            overflow: hidden;
            animation: ptsd-modal-in 0.3s ease-out;
        }
        
        @keyframes ptsd-modal-in {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .ptsd-modal-close {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 36px;
            height: 36px;
            border: none;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #5a6573;
            z-index: 10;
            transition: all 0.2s;
        }
        
        .ptsd-modal-close:hover {
            background: white;
            color: #1a1d23;
        }
        
        @media (max-width: 640px) {
            .ptsd-modal {
                padding: 0;
            }
            
            .ptsd-modal-content {
                max-width: 100%;
                height: 100vh;
                max-height: 100vh;
                border-radius: 0;
            }
        }
    `;

    let initialized = false;
    let options = {};

    /**
     * Initialize the embed
     */
    function init(opts = {}) {
        if (initialized) return;
        
        options = {
            theme: opts.theme || getScriptAttribute('data-theme') || CONFIG.defaultTheme,
            baseUrl: opts.baseUrl || getBaseUrl(),
            position: opts.position || getScriptAttribute('data-position') || 'bottom'
        };

        injectStyles();
        createBanner();
        createModal();
        bindEvents();
        
        initialized = true;
    }

    /**
     * Get base URL from script src
     */
    function getBaseUrl() {
        const script = document.currentScript || 
            document.querySelector('script[src*="embed.js"]');
        if (script) {
            const src = script.src;
            return src.substring(0, src.lastIndexOf('/') + 1);
        }
        return '';
    }

    /**
     * Get attribute from script tag
     */
    function getScriptAttribute(name) {
        const script = document.currentScript || 
            document.querySelector('script[src*="embed.js"]');
        return script?.getAttribute(name);
    }

    /**
     * Inject required styles
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = BANNER_STYLES + MODAL_STYLES;
        document.head.appendChild(style);
    }

    /**
     * Create and insert banner
     */
    function createBanner() {
        const container = document.createElement('div');
        container.id = CONFIG.containerId;
        container.setAttribute('data-ptsd-theme', options.theme);
        
        container.innerHTML = `
            <div class="ptsd-banner">
                <div class="ptsd-banner-content">
                    <div class="ptsd-banner-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </div>
                    <div class="ptsd-banner-text">
                        <h2>Sprawdź swoje samopoczucie</h2>
                        <p>2-minutowy kwestionariusz dla służb mundurowych</p>
                    </div>
                </div>
                <button class="ptsd-banner-btn" id="ptsd-banner-cta">Rozpocznij</button>
                <span class="ptsd-banner-disclaimer">Kwestionariusz edukacyjny</span>
            </div>
        `;

        // Auto-position after article if data-position is set
        const position = options.position;
        if (position === 'after-article') {
            const article = document.querySelector('article') || 
                          document.querySelector('.article-content') ||
                          document.querySelector('.post-content') ||
                          document.querySelector('[class*="article"]');
            if (article) {
                article.insertAdjacentElement('afterend', container);
                return;
            }
        }
        
        // Default: append to body
        document.body.appendChild(container);
    }

    /**
     * Create modal
     */
    function createModal() {
        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = MODAL_HTML;
        document.body.appendChild(modalWrapper.firstElementChild);
    }

    /**
     * Bind events
     */
    function bindEvents() {
        // Banner CTA click
        document.getElementById('ptsd-banner-cta')?.addEventListener('click', openModal);
        
        // Modal close
        document.getElementById('ptsd-modal-close')?.addEventListener('click', closeModal);
        document.querySelector('.ptsd-modal-overlay')?.addEventListener('click', closeModal);
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
        
        // Handle messages from iframe
        window.addEventListener('message', (e) => {
            if (e.data === 'ptsd:close') {
                closeModal();
            }
        });
    }

    /**
     * Open modal
     */
    function openModal() {
        const modal = document.getElementById('ptsd-modal');
        const iframe = document.getElementById('ptsd-iframe');
        
        if (modal && iframe) {
            // Set iframe source with theme parameter
            const screenerUrl = options.baseUrl + 'index.html?embed=1&theme=' + encodeURIComponent(options.theme);
            iframe.src = screenerUrl;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     */
    function closeModal() {
        const modal = document.getElementById('ptsd-modal');
        const iframe = document.getElementById('ptsd-iframe');
        
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Clear iframe src to reset state
        if (iframe) {
            setTimeout(() => {
                iframe.src = '';
            }, 300);
        }
    }

    /**
     * Set theme
     */
    function setTheme(theme) {
        options.theme = theme;
        const container = document.getElementById(CONFIG.containerId);
        if (container) {
            container.setAttribute('data-ptsd-theme', theme);
        }
    }

    /**
     * Public API
     */
    window.PTSDScreenerEmbed = {
        init,
        open: openModal,
        close: closeModal,
        setTheme,
        version: '1.0.0'
    };

    // Auto-init if script has data-auto-init
    const script = document.currentScript;
    if (script && script.getAttribute('data-auto-init') !== 'false') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => init());
        } else {
            init();
        }
    }
})();