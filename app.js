/**
 * PTSD Screener for Defence24.pl
 * PC-PTSD-5 Screening Tool
 * MDR Compliant - Educational purposes only
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'ptsd_screener_state',
        themeKey: 'ptsd_screener_theme',
        questions: [
            {
                id: 1,
                text: 'Czy masz wspomnienia, myśli lub obrazy, które wracają do Ciebie bez kontroli, dotyczące tego zdarzenia?'
            },
            {
                id: 2,
                text: 'Czy masz koszmary senne o tym zdarzeniu?'
            },
            {
                id: 3,
                text: 'Czy czujesz się nagle, jakby to zdarzenie działo się znowu lub widzisz je ponownie?'
            },
            {
                id: 4,
                text: 'Czy czujesz się bardzo zaniepokojony/a, gdy coś przypomina Ci o tym zdarzeniu?'
            },
            {
                id: 5,
                text: 'Czy unikasz myśli, uczuć lub sytuacji, które przypominają Ci o tym zdarzeniu?'
            }
        ]
    };

    // State management
    let state = {
        currentStep: 'banner', // banner, disclaimer, trauma, questions, summary
        traumaExperienced: null,
        answers: [],
        currentQuestionIndex: 0,
        theme: 'auto'
    };

    // DOM Elements cache
    const elements = {};

    /**
     * Parse URL parameters
     */
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            embed: params.get('embed') === '1',
            theme: params.get('theme') || null
        };
    }

    /**
     * Initialize the application
     */
    function init() {
        cacheElements();
        
        // Check URL params for theme override
        const urlParams = getUrlParams();
        if (urlParams.theme && ['light', 'dark', 'auto'].includes(urlParams.theme)) {
            state.theme = urlParams.theme;
            sessionStorage.setItem(CONFIG.themeKey, state.theme);
        }
        
        loadTheme();
        applyTheme();
        bindEvents();
        
        // Check for saved state (but don't auto-resume for privacy)
        // Clear any old state on init
        clearState();
    }

    /**
     * Cache DOM elements for performance
     */
    function cacheElements() {
        const wrapper = document.getElementById('ptsd-screener');
        if (!wrapper) return;

        elements.wrapper = wrapper;
        elements.banner = document.getElementById('banner');
        elements.modal = document.getElementById('modal');
        elements.disclaimerScreen = document.getElementById('disclaimer-screen');
        elements.traumaScreen = document.getElementById('trauma-screen');
        elements.questionsScreen = document.getElementById('questions-screen');
        elements.summaryScreen = document.getElementById('summary-screen');
        
        elements.startBtn = document.getElementById('start-btn');
        elements.closeBtn = document.getElementById('close-btn');
        elements.proceedBtn = document.getElementById('proceed-btn');
        elements.backBtn = document.getElementById('back-btn');
        elements.restartBtn = document.getElementById('restart-btn');
        elements.themeToggle = document.getElementById('theme-toggle');
        
        elements.disclaimerCheck = document.getElementById('disclaimer-check');
        elements.questionNumber = document.getElementById('question-number');
        elements.questionText = document.getElementById('question-text');
        elements.progressFill = document.getElementById('progress-fill');
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', openModal);
        }
        
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', closeModal);
        }
        
        if (elements.proceedBtn) {
            elements.proceedBtn.addEventListener('click', () => goToStep('trauma'));
        }
        
        if (elements.disclaimerCheck) {
            elements.disclaimerCheck.addEventListener('change', (e) => {
                elements.proceedBtn.disabled = !e.target.checked;
            });
        }
        
        if (elements.backBtn) {
            elements.backBtn.addEventListener('click', goBack);
        }
        
        if (elements.restartBtn) {
            elements.restartBtn.addEventListener('click', resetAndRestart);
        }
        
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // Trauma question handlers
        const traumaBtns = elements.traumaScreen?.querySelectorAll('.btn-answer');
        traumaBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => handleTraumaAnswer(e.target.dataset.value));
        });

        // Question handlers
        const questionBtns = elements.questionsScreen?.querySelectorAll('.btn-answer');
        questionBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => handleQuestionAnswer(e.target.dataset.value));
        });

        // Close on overlay click
        const overlay = elements.modal?.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
        
        // Handle page unload - clear sensitive data
        window.addEventListener('beforeunload', clearState);
    }

    /**
     * Open the modal
     */
    function openModal() {
        elements.modal?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        goToStep('disclaimer');
    }

    /**
     * Close the modal
     */
    function closeModal() {
        elements.modal?.classList.add('hidden');
        document.body.style.overflow = '';
        clearState();
        goToStep('banner');
    }

    /**
     * Navigate to a specific step
     */
    function goToStep(step) {
        // Hide all screens
        elements.disclaimerScreen?.classList.add('hidden');
        elements.traumaScreen?.classList.add('hidden');
        elements.questionsScreen?.classList.add('hidden');
        elements.summaryScreen?.classList.add('hidden');

        state.currentStep = step;

        switch (step) {
            case 'disclaimer':
                elements.disclaimerScreen?.classList.remove('hidden');
                // Reset disclaimer checkbox
                if (elements.disclaimerCheck) {
                    elements.disclaimerCheck.checked = false;
                }
                if (elements.proceedBtn) {
                    elements.proceedBtn.disabled = true;
                }
                break;
                
            case 'trauma':
                elements.traumaScreen?.classList.remove('hidden');
                break;
                
            case 'questions':
                elements.questionsScreen?.classList.remove('hidden');
                renderQuestion();
                break;
                
            case 'summary':
                elements.summaryScreen?.classList.remove('hidden');
                break;
        }
    }

    /**
     * Handle trauma question answer
     */
    function handleTraumaAnswer(value) {
        state.traumaExperienced = value === 'yes';
        
        if (state.traumaExperienced) {
            state.currentQuestionIndex = 0;
            state.answers = [];
            goToStep('questions');
        } else {
            // If no trauma experienced, skip to summary without showing questions
            goToStep('summary');
        }
    }

    /**
     * Render current question
     */
    function renderQuestion() {
        const question = CONFIG.questions[state.currentQuestionIndex];
        
        if (elements.questionNumber) {
            elements.questionNumber.textContent = `Pytanie ${state.currentQuestionIndex + 1} z ${CONFIG.questions.length}`;
        }
        
        if (elements.questionText) {
            elements.questionText.textContent = question.text;
        }
        
        if (elements.progressFill) {
            const progress = ((state.currentQuestionIndex + 1) / CONFIG.questions.length) * 100;
            elements.progressFill.style.width = `${progress}%`;
        }

        // Show/hide back button based on question index
        if (elements.backBtn) {
            elements.backBtn.style.visibility = state.currentQuestionIndex > 0 ? 'visible' : 'hidden';
        }
    }

    /**
     * Handle question answer
     */
    function handleQuestionAnswer(value) {
        state.answers[state.currentQuestionIndex] = value;
        
        if (state.currentQuestionIndex < CONFIG.questions.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            goToStep('summary');
        }
    }

    /**
     * Go back to previous question
     */
    function goBack() {
        if (state.currentStep === 'questions' && state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        } else if (state.currentStep === 'questions' && state.currentQuestionIndex === 0) {
            goToStep('trauma');
        } else if (state.currentStep === 'trauma') {
            goToStep('disclaimer');
        }
    }

    /**
     * Reset and restart the screener
     */
    function resetAndRestart() {
        state.traumaExperienced = null;
        state.answers = [];
        state.currentQuestionIndex = 0;
        goToStep('disclaimer');
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboard(e) {
        if (elements.modal?.classList.contains('hidden')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    /**
     * Theme management
     */
    function loadTheme() {
        // Check for saved theme preference
        const savedTheme = sessionStorage.getItem(CONFIG.themeKey);
        if (savedTheme) {
            state.theme = savedTheme;
        } else {
            state.theme = 'auto';
        }
        applyTheme();
    }

    function toggleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(state.theme);
        state.theme = themes[(currentIndex + 1) % themes.length];
        sessionStorage.setItem(CONFIG.themeKey, state.theme);
        applyTheme();
    }

    function applyTheme() {
        elements.wrapper?.setAttribute('data-theme', state.theme);
    }

    /**
     * Clear sensitive state data
     */
    function clearState() {
        try {
            sessionStorage.removeItem(CONFIG.storageKey);
        } catch (e) {
            // Ignore storage errors
        }
    }

    /**
     * Expose API for embed script
     */
    window.PTSDScreener = {
        init,
        open: openModal,
        close: closeModal,
        setTheme: (theme) => {
            state.theme = theme;
            applyTheme();
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();