// Navigation system for loading content from organized folder structure

class NavigationManager {
    constructor() {
        this.contentMapping = {
            // Getting Started
            'introduction': 'getting-started/introduction.html',
            'installation': 'getting-started/installation.html',
            'setup': 'getting-started/project-setup.html',
            'first-app': 'getting-started/your-first-app.html',

            // Routing
            'routing-overview': 'routing/index.html',
            'pages': 'routing/pages.html',
            'dynamic-routes': 'routing/dynamic-routes.html',
            'api-routes': 'routing/api-routes.html',

            // Rendering
            'ssr': 'rendering/ssr.html',
            'ssg': 'rendering/ssg.html',
            'isr': 'rendering/isr.html',
            'client-side': 'rendering/client-side.html',

            // Data Fetching
            'getstaticprops': 'data-fetching/getstaticprops.html',
            'getserversideprops': 'data-fetching/getserversideprops.html',
            'swr': 'data-fetching/swr.html',

            // Styling
            'css-modules': 'styling/css-modules.html',
            'styled-components': 'styling/styled-components.html',
            'tailwind': 'styling/tailwind.html',

            // Performance
            'image-optimization': 'performance/image-optimization.html',
            'bundle-analysis': 'performance/bundle-analysis.html',
            'code-splitting': null, // Add as static content or create file

            // Deployment
            'vercel': 'deployment/vercel.html',
            'other-platforms': 'deployment/other-platforms.html',
            'env-vars': null, // Add as static content or create file

            // Static content (fallback for sections without dedicated files)
            'api-reference': null,
            'best-practices': null,
            'examples': null
        };

        this.currentPage = null;
        this.mainContent = null;
        this.init();
    }

    init() {
        this.mainContent = document.getElementById('main-content');
        this.setupEventListeners();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Handle sidebar navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const pageId = href.substring(1);
                    this.navigateToPage(pageId);
                    this.updateActiveLink(e.target);
                }
            }
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (e) => {
            const pageId = e.state?.pageId || this.getPageIdFromHash();
            if (pageId) {
                this.navigateToPage(pageId, false);
            }
        });
    }

    handleInitialLoad() {
        const pageId = this.getPageIdFromHash();
        if (pageId && this.contentMapping[pageId]) {
            this.navigateToPage(pageId, false);
        } else {
            // Load default page (installation)
            this.navigateToPage('installation', false);
        }
    }

    getPageIdFromHash() {
        return window.location.hash.substring(1);
    }

    async navigateToPage(pageId, pushState = true) {
        const filePath = this.contentMapping[pageId];

        if (filePath === undefined) {
            console.warn(`No content mapping found for page: ${pageId}`);
            return;
        }

        try {
            // Show loading state
            this.showLoadingState();

            // Handle static content sections (where filePath is null)
            if (filePath === null) {
                this.showStaticContent(pageId);
            } else {
                // Fetch the content from file
                const response = await fetch(filePath);

                if (!response.ok) {
                    throw new Error(`Failed to load content: ${response.status}`);
                }

                const content = await response.text();

                // Update main content
                this.mainContent.innerHTML = content;
            }

            // Update URL and browser history
            if (pushState) {
                const newUrl = `#${pageId}`;
                history.pushState({ pageId }, '', newUrl);
            }

            // Update current page
            this.currentPage = pageId;

            // Update active sidebar link
            this.updateActiveLinkByPageId(pageId);

            // Initialize any new content features
            this.initializeContentFeatures();

            // Scroll to top
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Error loading page content:', error);
            this.showErrorState(error.message);
        }
    }

    showLoadingState() {
        this.mainContent.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span class="ml-3 text-gray-600 dark:text-gray-300">Loading content...</span>
            </div>
        `;
    }

    showErrorState(message) {
        this.mainContent.innerHTML = `
            <div class="text-center py-12">
                <div class="text-red-500 dark:text-red-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Content</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${message}</p>
                <button onclick="window.location.reload()" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">
                    Reload Page
                </button>
            </div>
        `;
    }

    showStaticContent(pageId) {
        const staticContent = {
            'api-reference': `
                <section id="api-reference" class="mb-12">
                    <h2>API Reference</h2>
                    <p>Complete reference for Next.js APIs and configuration options.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h3 class="font-semibold mb-2">Functions</h3>
                            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <li><code>getStaticProps</code></li>
                                <li><code>getStaticPaths</code></li>
                                <li><code>getServerSideProps</code></li>
                                <li><code>getInitialProps</code></li>
                            </ul>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h3 class="font-semibold mb-2">Components</h3>
                            <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <li><code>Image</code></li>
                                <li><code>Link</code></li>
                                <li><code>Head</code></li>
                                <li><code>Script</code></li>
                            </ul>
                        </div>
                    </div>
                </section>
            `,
            'best-practices': `
                <section id="best-practices" class="mb-12">
                    <h2>Best Practices</h2>
                    <p>Follow these best practices to build high-quality Next.js applications.</p>
                    
                    <div class="space-y-4">
                        <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4">
                            <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Performance</h3>
                            <ul class="text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Use the Next.js Image component for optimized images</li>
                                <li>• Implement proper caching strategies</li>
                                <li>• Use dynamic imports for code splitting</li>
                            </ul>
                        </div>
                        
                        <div class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
                            <h3 class="font-semibold text-green-900 dark:text-green-100 mb-2">SEO</h3>
                            <ul class="text-green-800 dark:text-green-200 space-y-1">
                                <li>• Use proper meta tags with next/head</li>
                                <li>• Implement structured data</li>
                                <li>• Optimize for Core Web Vitals</li>
                            </ul>
                        </div>
                        
                        <div class="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4">
                            <h3 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Security</h3>
                            <ul class="text-purple-800 dark:text-purple-200 space-y-1">
                                <li>• Sanitize user inputs</li>
                                <li>• Use HTTPS in production</li>
                                <li>• Implement proper authentication</li>
                            </ul>
                        </div>
                    </div>
                </section>
            `,
            'examples': `
                <section id="examples" class="mb-12">
                    <h2>Examples & Tutorials</h2>
                    <p>Explore real-world examples and step-by-step tutorials.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 class="font-semibold mb-2">Blog Example</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">A complete blog with markdown support and static generation.</p>
                            <a href="#" class="text-primary-500 hover:text-primary-600 text-sm font-medium">View Example →</a>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 class="font-semibold mb-2">E-commerce Store</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Full-featured e-commerce site with Stripe integration.</p>
                            <a href="#" class="text-primary-500 hover:text-primary-600 text-sm font-medium">View Example →</a>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 class="font-semibold mb-2">Dashboard App</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Admin dashboard with authentication and data visualization.</p>
                            <a href="#" class="text-primary-500 hover:text-primary-600 text-sm font-medium">View Example →</a>
                        </div>
                    </div>
                </section>
            `
        };

        const content = staticContent[pageId];
        if (content) {
            this.mainContent.innerHTML = content;
        } else {
            this.showErrorState(`Content not available for: ${pageId}`);
        }
    }

    updateActiveLink(clickedLink) {
        // Remove active class from all sidebar links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('text-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
        });

        // Add active class to clicked link
        clickedLink.classList.add('text-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
    }

    updateActiveLinkByPageId(pageId) {
        // Remove active class from all sidebar links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('text-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
        });

        // Find and activate the correct link
        const targetLink = document.querySelector(`a[href="#${pageId}"]`);
        if (targetLink) {
            targetLink.classList.add('text-primary-500', 'bg-primary-50', 'dark:bg-primary-900');

            // Ensure parent section is expanded
            const parentSection = targetLink.closest('.sidebar-section');
            if (parentSection) {
                const content = parentSection.querySelector('.sidebar-content');
                const toggle = parentSection.querySelector('.sidebar-toggle svg');
                if (content && toggle) {
                    content.style.display = 'block';
                    toggle.style.transform = 'rotate(180deg)';
                }
            }
        }
    }

    initializeContentFeatures() {
        // Re-initialize features that need to work with new content

        // Syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

        // Copy buttons for code blocks
        this.initializeCodeCopyButtons();

        // Table of contents if present
        this.initializeTableOfContents();

        // Any other content-specific features
        this.initializeContentLinks();
    }

    initializeCodeCopyButtons() {
        const codeBlocks = this.mainContent.querySelectorAll('pre[class*="language-"]');
        codeBlocks.forEach(block => {
            if (!block.querySelector('.copy-button')) {
                const button = document.createElement('button');
                button.className = 'copy-button absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity';
                button.textContent = 'Copy';

                button.addEventListener('click', () => {
                    const code = block.querySelector('code').textContent;
                    navigator.clipboard.writeText(code).then(() => {
                        button.textContent = 'Copied!';
                        setTimeout(() => {
                            button.textContent = 'Copy';
                        }, 2000);
                    });
                });

                block.style.position = 'relative';
                block.classList.add('group');
                block.appendChild(button);
            }
        });
    }

    initializeTableOfContents() {
        const headings = this.mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const tocContainer = this.mainContent.querySelector('.table-of-contents');

        if (headings.length > 1 && tocContainer) {
            const tocList = document.createElement('ul');
            tocList.className = 'space-y-2';

            headings.forEach((heading, index) => {
                const id = heading.id || `heading-${index}`;
                heading.id = id;

                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${id}`;
                a.textContent = heading.textContent;
                a.className = `block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 pl-${(parseInt(heading.tagName.charAt(1)) - 1) * 4}`;

                li.appendChild(a);
                tocList.appendChild(li);
            });

            tocContainer.innerHTML = '<h4 class="font-medium text-gray-900 dark:text-white mb-3">Table of Contents</h4>';
            tocContainer.appendChild(tocList);
        }
    }

    initializeContentLinks() {
        // Handle internal links within content
        const internalLinks = this.mainContent.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const pageId = href.substring(1);

                if (this.contentMapping[pageId]) {
                    e.preventDefault();
                    this.navigateToPage(pageId);
                }
            });
        });
    }

    // Public method to navigate programmatically
    goToPage(pageId) {
        this.navigateToPage(pageId);
    }

    // Get current page
    getCurrentPage() {
        return this.currentPage;
    }

    // Check if page exists
    pageExists(pageId) {
        return this.contentMapping.hasOwnProperty(pageId);
    }
}

// Export for use in other files
window.NavigationManager = NavigationManager;
