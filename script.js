// Next.js Documentation Website JavaScript
// Handles all interactive functionality including theme switching, search, navigation, etc.

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initializeTheme();
    initializeSearch();
    initializeSidebar();
    initializeNavigation();
    initializeScrollProgress();
    initializeCopyButtons();
    initializeTableOfContents();
    initializeBackToTop();
    initializePrintStyles();

    // Prism.js syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    }

    themeToggle.addEventListener('click', function () {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    function updateThemeIcon(isDark) {
        themeIcon.innerHTML = isDark
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const searchOverlay = document.getElementById('search-overlay');
    const searchResults = document.getElementById('search-results');

    // Search data - in a real app, this would come from an API or search index
    const searchData = [
        {
            title: 'Installation',
            content: 'Create a new Next.js application using create-next-app',
            url: '#installation',
            section: 'Getting Started'
        },
        {
            title: 'Pages',
            content: 'File-system based router built on the concept of pages',
            url: '#pages',
            section: 'Routing'
        },
        {
            title: 'Dynamic Routes',
            content: 'Pages with dynamic routes using bracket notation',
            url: '#dynamic-routes',
            section: 'Routing'
        },
        {
            title: 'API Routes',
            content: 'Build your API with Next.js using pages/api directory',
            url: '#api-routes',
            section: 'Routing'
        },
        {
            title: 'Server-Side Rendering',
            content: 'Pre-render pages on each request using getServerSideProps',
            url: '#ssr',
            section: 'Rendering'
        },
        {
            title: 'Static Generation',
            content: 'Pre-render pages at build time using getStaticProps',
            url: '#ssg',
            section: 'Rendering'
        },
        {
            title: 'getStaticProps',
            content: 'Fetch data at build time for static generation',
            url: '#getstaticprops',
            section: 'Data Fetching'
        },
        {
            title: 'CSS Modules',
            content: 'Locally scoped CSS using module.css files',
            url: '#css-modules',
            section: 'Styling'
        },
        {
            title: 'Image Optimization',
            content: 'Built-in Image component for automatic optimization',
            url: '#image-optimization',
            section: 'Performance'
        },
        {
            title: 'Deployment',
            content: 'Deploy to Vercel or other platforms',
            url: '#vercel',
            section: 'Deployment'
        }
    ];

    let searchTimeout;

    function performSearch(query) {
        if (!query.trim()) {
            hideSearchResults();
            return;
        }

        const results = searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.section.toLowerCase().includes(query.toLowerCase())
        );

        displaySearchResults(results, query);
    }

    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No results found</p>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                    <a href="${result.url}" class="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-2 -m-2" onclick="hideSearchResults()">
                        <div class="flex items-center justify-between mb-1">
                            <h4 class="font-medium text-gray-900 dark:text-white">${highlightMatch(result.title, query)}</h4>
                            <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">${result.section}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${highlightMatch(result.content, query)}</p>
                    </a>
                </div>
            `).join('');
        }

        showSearchResults();
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    }

    function showSearchResults() {
        searchOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideSearchResults() {
        searchOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Event listeners
    [searchInput, mobileSearchInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function (e) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
            });

            input.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    hideSearchResults();
                    input.blur();
                }
            });
        }
    });

    // Close search overlay when clicking outside
    searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) {
            hideSearchResults();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            (searchInput || mobileSearchInput)?.focus();
        }

        // Escape to close search
        if (e.key === 'Escape') {
            hideSearchResults();
        }
    });
}

// Sidebar Management
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', function () {
        sidebar.classList.toggle('-translate-x-full');
    });

    // Collapsible sidebar sections
    sidebarToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const section = this.closest('.sidebar-section');
            const content = section.querySelector('.sidebar-content');
            const icon = this.querySelector('svg');

            if (content) {
                const isOpen = !content.classList.contains('hidden');
                content.classList.toggle('hidden');
                icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });

    // Active link highlighting
    function updateActiveLink() {
        const currentHash = window.location.hash;
        sidebarLinks.forEach(link => {
            link.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600', 'dark:text-primary-400');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600', 'dark:text-primary-400');
            }
        });
    }

    // Close mobile sidebar when clicking a link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth < 1024) {
                sidebar.classList.add('-translate-x-full');
            }
            updateActiveLink();
        });
    });

    // Update active link on hash change
    window.addEventListener('hashchange', updateActiveLink);
    updateActiveLink(); // Initial call

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (window.innerWidth < 1024 &&
            !sidebar.contains(e.target) &&
            !mobileMenuToggle.contains(e.target) &&
            !sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
        }
    });
}

// Navigation (Previous/Next)
function initializeNavigation() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // Define page order
    const pages = [
        'welcome', 'installation', 'setup', 'first-app', 'pages', 'dynamic-routes',
        'api-routes', 'ssr', 'ssg', 'isr', 'getstaticprops', 'css-modules',
        'image-optimization', 'vercel', 'api-reference', 'best-practices', 'examples'
    ];

    function updateNavigation() {
        const currentHash = window.location.hash.replace('#', '') || 'welcome';
        const currentIndex = pages.indexOf(currentHash);

        // Update previous button
        if (currentIndex > 0) {
            prevButton.disabled = false;
            prevButton.onclick = () => navigateToSection(pages[currentIndex - 1]);
        } else {
            prevButton.disabled = true;
        }

        // Update next button
        if (currentIndex < pages.length - 1) {
            nextButton.disabled = false;
            nextButton.onclick = () => navigateToSection(pages[currentIndex + 1]);
        } else {
            nextButton.disabled = true;
        }
    }

    function navigateToSection(sectionId) {
        window.location.hash = '#' + sectionId;
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }

    window.addEventListener('hashchange', updateNavigation);
    updateNavigation(); // Initial call
}

// Scroll Progress Indicator
function initializeScrollProgress() {
    const progressBar = document.getElementById('progress-bar');

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

// Copy to Clipboard Functionality
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const textToCopy = this.getAttribute('data-copy');

            try {
                await navigator.clipboard.writeText(textToCopy);
                showCopyFeedback(this);
            } catch (err) {
                // Fallback for older browsers
                fallbackCopyTextToClipboard(textToCopy, this);
            }
        });
    });

    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;

        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }

    function fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showCopyFeedback(button);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
}

// Table of Contents
function initializeTableOfContents() {
    const tocList = document.getElementById('toc-list');
    const tocContainer = document.getElementById('table-of-contents');

    function generateTOC() {
        const headings = document.querySelectorAll('#main-content h2, #main-content h3');
        const tocItems = [];

        headings.forEach(heading => {
            if (heading.id) {
                const level = heading.tagName === 'H2' ? 1 : 2;
                const paddingClass = level === 1 ? '' : 'pl-4';

                tocItems.push(`
                    <li class="${paddingClass}">
                        <a href="#${heading.id}" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                            ${heading.textContent}
                        </a>
                    </li>
                `);
            }
        });

        if (tocItems.length > 0) {
            tocList.innerHTML = tocItems.join('');
            tocContainer.style.display = 'block';
        } else {
            tocContainer.style.display = 'none';
        }
    }

    // Smooth scroll for TOC links
    tocList.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                window.location.hash = '#' + targetId;
            }
        }
    });

    generateTOC();
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    }

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial call
}

// Print Styles and Functionality
function initializePrintStyles() {
    // Add print button functionality
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Let the browser handle the print dialog
            // Our CSS print styles will take care of the formatting
        }
    });

    // Optimize content for printing
    window.addEventListener('beforeprint', function () {
        // Expand all collapsed sections for printing
        document.querySelectorAll('.sidebar-content.hidden').forEach(content => {
            content.classList.remove('hidden');
            content.setAttribute('data-was-hidden', 'true');
        });
    });

    window.addEventListener('afterprint', function () {
        // Restore collapsed state after printing
        document.querySelectorAll('.sidebar-content[data-was-hidden="true"]').forEach(content => {
            content.classList.add('hidden');
            content.removeAttribute('data-was-hidden');
        });
    });
}

// Breadcrumb Updates
function updateBreadcrumbs() {
    const currentSection = document.getElementById('current-section');
    const currentHash = window.location.hash.replace('#', '');

    // Map sections to their parent categories
    const sectionMap = {
        'installation': 'Getting Started',
        'setup': 'Getting Started',
        'first-app': 'Getting Started',
        'pages': 'Routing',
        'dynamic-routes': 'Routing',
        'api-routes': 'Routing',
        'ssr': 'Rendering',
        'ssg': 'Rendering',
        'isr': 'Rendering',
        'client-side': 'Rendering',
        'getstaticprops': 'Data Fetching',
        'getserversideprops': 'Data Fetching',
        'swr': 'Data Fetching',
        'css-modules': 'Styling',
        'styled-components': 'Styling',
        'tailwind': 'Styling',
        'image-optimization': 'Performance',
        'bundle-analysis': 'Performance',
        'vercel': 'Deployment',
        'other-platforms': 'Deployment'
    };

    const sectionName = sectionMap[currentHash] || 'Getting Started';
    currentSection.textContent = sectionName;
}

// Initialize breadcrumb updates
window.addEventListener('hashchange', updateBreadcrumbs);
updateBreadcrumbs();

// Accessibility Enhancements
document.addEventListener('keydown', function (e) {
    // Skip to main content
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        skipLink.addEventListener('click', function () {
            document.getElementById('main-content').focus();
            skipLink.remove();
        });

        skipLink.addEventListener('blur', function () {
            setTimeout(() => skipLink.remove(), 100);
        });
    }
});

// Performance optimizations
let ticking = false;

function requestTick(callback) {
    if (!ticking) {
        requestAnimationFrame(callback);
        ticking = true;
    }
}

// Optimize scroll events
let scrollTimeout;
window.addEventListener('scroll', function () {
    requestTick(() => {
        ticking = false;
    });

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Perform any scroll-end operations here
    }, 150);
}, { passive: true });

// Lazy loading for images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Service Worker registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // Uncomment the following lines if you want to add service worker support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered: ', registration))
        //     .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}

// Export functions for testing or external use
window.NextJsDocs = {
    search: performSearch,
    updateBreadcrumbs,
    generateTOC: initializeTableOfContents,
    toggleTheme: () => document.getElementById('theme-toggle').click()
};
