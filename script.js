// Next.js Documentation Website JavaScript
// Handles all interactive functionality including theme switching, search, navigation, etc.

document.addEventListener('DOMContentLoaded', function () {
    // Load header and sidebar first, then initialize functionality
    Promise.all([
        loadHeaderContent(),
        loadSidebarContent()
    ]).then(() => {
        // Initialize all functionality after content is loaded
        initializeTheme();
        initializeSearch();
        setupSidebarInteractivity();

        // Initialize navigation system
        window.navigationManager = new NavigationManager();

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

// Header Management
async function loadHeaderContent() {
    try {
        const response = await fetch('header.html');
        const headerContent = await response.text();
        const header = document.getElementById('header');
        header.innerHTML = headerContent;
    } catch (error) {
        console.error('Error loading header:', error);
        // Fallback - you could provide minimal header content here
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

// Enhanced sidebar search functionality
function initializeSidebarSearch() {
    const searchInput = document.querySelector('nav input[placeholder="Search docs..."]');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (searchInput) {
        // Add keyboard shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', function (e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Real-time search filtering
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();

            sidebarLinks.forEach(link => {
                const text = link.textContent.toLowerCase();
                const section = link.closest('.sidebar-section');

                if (text.includes(searchTerm)) {
                    link.style.display = 'block';
                    link.classList.add('search-highlight');
                } else {
                    link.style.display = searchTerm ? 'none' : 'block';
                    link.classList.remove('search-highlight');
                }
            });

            // Show/hide sections based on visible links
            document.querySelectorAll('.sidebar-section').forEach(section => {
                const visibleLinks = section.querySelectorAll('.sidebar-link[style*="block"]');
                section.style.display = visibleLinks.length > 0 || !searchTerm ? 'block' : 'none';
            });
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                e.target.value = '';
                e.target.dispatchEvent(new Event('input'));
                e.target.blur();
            }
        });
    }
}

// Sidebar Management
async function loadSidebarContent() {
    try {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = generateSidebarHTML();
    } catch (error) {
        console.error('Error loading sidebar:', error);
        // Fallback - you could provide minimal sidebar content here
    }
}

// Generate sidebar HTML content
function generateSidebarHTML() {
    // Sidebar data structure
    const sidebarData = [
        {
            id: "getting-started",
            title: "Getting Started",
            icon: "🚀",
            description: "Begin your journey",
            color: "emerald",
            items: [
                { title: "Introduction", href: "#introduction", icon: "📖" },
                { title: "Installation", href: "#installation", icon: "📦" },
                { title: "Project Setup", href: "#setup", icon: "⚙️" },
                { title: "Your First App", href: "#first-app", icon: "🎯" },
            ],
        },
        {
            id: "routing",
            title: "Routing",
            icon: "🛣️",
            description: "Navigate your app",
            color: "blue",
            items: [
                { title: "Routing Overview", href: "#routing-overview", icon: "🛣️" },
                { title: "Pages", href: "#pages", icon: "📄" },
                { title: "Dynamic Routes", href: "#dynamic-routes", icon: "🔄" },
                { title: "API Routes", href: "#api-routes", icon: "🛠️" },
            ],
        },
        {
            id: "rendering",
            title: "Rendering",
            icon: "🎨",
            description: "Render strategies",
            color: "purple",
            items: [
                { title: "Server-Side Rendering", href: "#ssr", icon: "🖥️" },
                { title: "Static Generation", href: "#ssg", icon: "📋" },
                {
                    title: "Incremental Static Regeneration",
                    href: "#isr",
                    icon: "🔄",
                },
                { title: "Client-Side Rendering", href: "#client-side", icon: "💻" },
            ],
        },
        {
            id: "data-fetching",
            title: "Data Fetching",
            icon: "📊",
            description: "Fetch and manage data",
            color: "green",
            items: [
                {
                    title: "getServerSideProps",
                    href: "#getserversideprops",
                    icon: "⬇️",
                },
                { title: "getStaticProps", href: "#getstaticprops", icon: "📝" },
                { title: "SWR", href: "#swr", icon: "🔄" },
                { title: "API Routes", href: "#api-routes", icon: "🔗" },
            ],
        },
        {
            id: "styling",
            title: "Styling",
            icon: "🎭",
            description: "Style your components",
            color: "pink",
            items: [
                { title: "CSS Modules", href: "#css-modules", icon: "🎨" },
                {
                    title: "Styled Components",
                    href: "#styled-components",
                    icon: "💅",
                },
                { title: "Tailwind CSS", href: "#tailwind", icon: "🌊" },
            ],
        },
        {
            id: "performance",
            title: "Performance",
            icon: "⚡",
            description: "Optimize your app",
            color: "yellow",
            items: [
                {
                    title: "Image Optimization",
                    href: "#image-optimization",
                    icon: "🖼️",
                },
                { title: "Bundle Analysis", href: "#bundle-analysis", icon: "📦" },
                { title: "Code Splitting", href: "#code-splitting", icon: "✂️" },
            ],
        },
        {
            id: "deployment",
            title: "Deployment",
            icon: "🚀",
            description: "Deploy your app",
            color: "indigo",
            items: [
                { title: "Vercel", href: "#vercel", icon: "▲" },
                { title: "Other Platforms", href: "#other-platforms", icon: "☁️" },
                { title: "Environment Variables", href: "#env-vars", icon: "🔐" },
            ],
        },
    ];

    // Color classes for different sections
    const colorClasses = {
        emerald: {
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-700 dark:text-emerald-300",
            border: "border-emerald-200 dark:border-emerald-700",
            hover: "hover:bg-emerald-100 dark:hover:bg-emerald-800/30",
        },
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-700 dark:text-blue-300",
            border: "border-blue-200 dark:border-blue-700",
            hover: "hover:bg-blue-100 dark:hover:bg-blue-800/30",
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-700 dark:text-purple-300",
            border: "border-purple-200 dark:border-purple-700",
            hover: "hover:bg-purple-100 dark:hover:bg-purple-800/30",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900/20",
            text: "text-green-700 dark:text-green-300",
            border: "border-green-200 dark:border-green-700",
            hover: "hover:bg-green-100 dark:hover:bg-green-800/30",
        },
        pink: {
            bg: "bg-pink-50 dark:bg-pink-900/20",
            text: "text-pink-700 dark:text-pink-300",
            border: "border-pink-200 dark:border-pink-700",
            hover: "hover:bg-pink-100 dark:hover:bg-pink-800/30",
        },
        yellow: {
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            text: "text-yellow-700 dark:text-yellow-300",
            border: "border-yellow-200 dark:border-yellow-700",
            hover: "hover:bg-yellow-100 dark:hover:bg-yellow-800/30",
        },
        indigo: {
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
            text: "text-indigo-700 dark:text-indigo-300",
            border: "border-indigo-200 dark:border-indigo-700",
            hover: "hover:bg-indigo-100 dark:hover:bg-indigo-800/30",
        }
    };

    const sidebarSections = sidebarData
        .map((section) => {
            const colors = colorClasses[section.color] || colorClasses.blue;

            return `
                <div class="sidebar-section mb-3 relative">
                    <button class="sidebar-toggle w-full flex items-center justify-between p-3 text-left rounded-lg ${colors.hover} font-medium text-gray-900 dark:text-white transition-all duration-300 hover:shadow-md hover:translate-x-1 group"
                            data-section="${section.id}">
                        <div class="flex items-center space-x-3">
                            <div class="flex items-center justify-center w-9 h-9 ${colors.bg} rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110">
                                <span class="text-lg">${section.icon}</span>
                            </div>
                            <div class="flex-1">
                                <div class="font-semibold text-sm ${colors.text} transition-colors duration-200">${section.title}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 opacity-75">${section.description}</div>
                            </div>
                        </div>
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-all duration-300 sidebar-arrow group-hover:text-gray-700 dark:group-hover:text-gray-200" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" 
                                  d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="sidebar-content hidden ml-12 mt-2 space-y-1 border-l-2 border-gray-100 dark:border-gray-700 pl-3 transition-all duration-300" data-content="${section.id}">
                        ${section.items
                    .map(
                        (item) => `
                            <a href="${item.href}" 
                               class="sidebar-link flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 ${colors.hover} rounded-md transition-all duration-200 hover:shadow-sm hover:translate-x-1 relative group border-l-2 border-transparent hover:border-current">
                                <span class="text-base flex-shrink-0 transition-transform duration-200 group-hover:scale-110">${item.icon}</span>
                                <span class="font-medium transition-colors duration-200">${item.title}</span>
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                            </a>
                        `
                    )
                    .join("")}
                    </div>
                </div>
            `;
        })
        .join("");

    return `<div class="space-y-2 p-2">${sidebarSections}</div>`;
}

// Setup sidebar interactivity after content is loaded
function setupSidebarInteractivity() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    // Re-query elements after content is loaded
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Mobile menu toggle with smooth animation
    mobileMenuToggle?.addEventListener('click', function () {
        sidebar.classList.toggle('-translate-x-full');

        // Add animation feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });

    // Initialize sidebar sections with enhanced animations
    sidebarToggles.forEach((toggle, index) => {
        const section = toggle.closest('.sidebar-section');
        const content = section.querySelector('.sidebar-content');
        const icon = toggle.querySelector('.sidebar-arrow');

        // Set initial states - first section (Getting Started) open by default
        if (index === 0) {
            section.classList.add('active');
            content.classList.remove('hidden');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                icon.style.color = '#3b82f6';
            }
        }

        // Enhanced click handler with smooth animations
        toggle.addEventListener('click', function () {
            const isActive = section.classList.contains('active');

            // Add click feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);

            // Smooth toggle animation
            if (isActive) {
                // Closing animation
                content.style.maxHeight = content.scrollHeight + 'px';
                content.offsetHeight; // Force reflow
                content.style.maxHeight = '0px';
                content.style.opacity = '0';

                setTimeout(() => {
                    content.classList.add('hidden');
                    content.style.maxHeight = '';
                    content.style.opacity = '';
                }, 300);

                section.classList.remove('active');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                    icon.style.color = '';
                }
            } else {
                // Opening animation
                content.classList.remove('hidden');
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.offsetHeight; // Force reflow
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';

                setTimeout(() => {
                    content.style.maxHeight = '';
                }, 300);

                section.classList.add('active');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                    icon.style.color = '#3b82f6';
                }
            }
        });

        // Enhanced hover effects for section toggles
        toggle.addEventListener('mouseenter', function () {
            if (!section.classList.contains('active')) {
                this.style.transform = 'translateX(4px)';
                if (icon) {
                    icon.style.color = '#6b7280';
                }
            }
        });

        toggle.addEventListener('mouseleave', function () {
            if (!section.classList.contains('active')) {
                this.style.transform = 'translateX(0px)';
                if (icon) {
                    icon.style.color = '';
                }
            }
        });
    });

    // Enhanced active link highlighting with smooth transitions
    function updateActiveLink() {
        const currentHash = window.location.hash;
        const currentSidebarLinks = document.querySelectorAll('.sidebar-link');

        currentSidebarLinks.forEach(link => {
            link.classList.remove('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-400', 'border-blue-500', 'shadow-md');

            if (link.getAttribute('href') === currentHash) {
                link.classList.add('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-400', 'border-blue-500', 'shadow-md');

                // Auto-expand parent section of active link
                const parentSection = link.closest('.sidebar-section');
                const content = parentSection.querySelector('.sidebar-content');
                const toggle = parentSection.querySelector('.sidebar-toggle');
                const icon = toggle.querySelector('.sidebar-arrow');

                if (content.classList.contains('hidden')) {
                    content.classList.remove('hidden');
                    parentSection.classList.add('active');
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                        icon.style.color = '#3b82f6';
                    }
                }

                // Smooth scroll into view if needed
                link.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        });
    }

    // Enhanced link interactions with better feedback
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Enhanced click animation
            this.style.transform = 'scale(0.96)';
            this.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';

            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
            }, 150);

            // Close mobile sidebar with delay for visual feedback
            if (window.innerWidth < 1024) {
                setTimeout(() => {
                    sidebar.classList.add('-translate-x-full');
                }, 200);
            }

            // Update active state with smooth transition
            setTimeout(() => {
                updateActiveLink();
            }, 100);
        });

        // Enhanced hover effects for links
        link.addEventListener('mouseenter', function () {
            if (!this.classList.contains('border-blue-500')) {
                this.style.transform = 'translateX(6px)';
                this.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!this.classList.contains('border-blue-500')) {
                this.style.transform = 'translateX(0px)';
                this.style.boxShadow = '';
            }
        });
    });

    // Update active link on hash change
    window.addEventListener('hashchange', updateActiveLink);
    updateActiveLink(); // Initial call

    // Enhanced mobile sidebar behavior
    document.addEventListener('click', function (e) {
        if (window.innerWidth < 1024 &&
            !sidebar.contains(e.target) &&
            !mobileMenuToggle?.contains(e.target) &&
            !sidebar.classList.contains('-translate-x-full')) {

            // Add closing animation
            sidebar.style.opacity = '0.8';
            setTimeout(() => {
                sidebar.classList.add('-translate-x-full');
                sidebar.style.opacity = '';
            }, 100);
        }
    });

    // Keyboard navigation for accessibility
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
        }
    });

    // Add smooth scroll behavior for better UX
    const sidebarContainer = document.getElementById('sidebar');
    if (sidebarContainer) {
        sidebarContainer.style.scrollBehavior = 'smooth';
    }
}

// Navigation (Previous/Next) - Now handled by NavigationManager

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

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </div>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669);' :
            type === 'error' ? 'background: linear-gradient(135deg, #ef4444, #dc2626);' :
                'background: linear-gradient(135deg, #3b82f6, #2563eb);'}
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animate sidebar stats on scroll
function animateSidebarStats() {
    const statsCards = document.querySelectorAll('.sidebar-footer .grid > div');

    if (statsCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.text-lg');
                if (numberElement) {
                    animateNumber(numberElement, parseInt(numberElement.textContent));
                }
            }
        });
    });

    statsCards.forEach(card => observer.observe(card));
}

// Number animation function
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 50);
}
