# Next.js Documentation Website

A complete, modern, and interactive documentation website for Next.js built with HTML, Tailwind CSS, and JavaScript.

## Features

### ✨ Design & UI

- **Modern responsive design** using Tailwind CSS via CDN
- **Dark/Light theme toggle** with system preference detection
- **Mobile-friendly** design with hamburger menu
- **Print-friendly** styles for documentation printing
- **Smooth animations** and transitions throughout

### 🧭 Navigation

- **Collapsible sidebar navigation** with organized sections
- **Breadcrumb navigation** for easy orientation
- **Table of contents** auto-generated for each page
- **Previous/Next page navigation** with smart routing
- **Back-to-top button** for long pages

### 🔍 Search & Discovery

- **Live search functionality** with real-time filtering
- **Search overlay** with keyboard shortcuts (Ctrl/Cmd + K)
- **Highlighted search results** with section categorization
- **Mobile search** optimized for touch devices

### 💻 Code Features

- **Syntax highlighting** using Prism.js for all code blocks
- **Copy-to-clipboard** functionality for all code examples
- **Interactive code samples** with proper formatting
- **Language-specific highlighting** (JavaScript, CSS, Bash, etc.)

### 📖 Content Sections

- **Getting Started**: Installation, setup, first app creation
- **Routing**: Pages, dynamic routes, API routes
- **Rendering**: SSR, SSG, ISR, client-side rendering
- **Data Fetching**: getStaticProps, getServerSideProps, SWR
- **Styling**: CSS Modules, Styled Components, Tailwind CSS
- **Performance**: Image optimization, bundle analysis
- **Deployment**: Vercel, Netlify, static export, other platforms
- **API Reference**: Complete function and component reference
- **Best Practices**: Performance, SEO, and security guidelines
- **Examples**: Real-world project examples and tutorials

### ⚡ Performance & Accessibility

- **Optimized scroll handling** with requestAnimationFrame
- **Lazy loading** for images and content
- **Keyboard navigation** support throughout
- **Screen reader friendly** with proper ARIA labels
- **Focus management** for better accessibility
- **Skip-to-content** functionality

### 🛠️ Technical Features

- **Local storage** for theme preferences
- **Service Worker** support ready (commented out)
- **Progressive enhancement** approach
- **No build process required** - runs directly in browser
- **CDN-based dependencies** for fast loading

## File Structure

```
nextjs_doc/
├── index.html          # Main HTML file with complete documentation
├── script.js           # JavaScript functionality and interactivity
└── README.md          # This documentation file
```

## Getting Started

1. **Clone or download** the files to your local machine
2. **Open `index.html`** in any modern web browser
3. **Enjoy the documentation!** All features work out of the box

### Local Development

For local development with live reloading, you can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Features Breakdown

### Theme System

- Automatic detection of system theme preference
- Manual toggle with persistent storage
- Smooth transitions between themes
- Consistent theming across all components

### Search System

- Real-time search with debouncing
- Fuzzy matching across titles, content, and sections
- Keyboard shortcuts for power users
- Mobile-optimized search interface
- Search result highlighting

### Navigation System

- Hierarchical sidebar with collapsible sections
- Active page highlighting
- Breadcrumb trail for context
- Auto-generated table of contents
- Smart previous/next navigation

### Code Examples

- Comprehensive Next.js code samples
- Real-world usage examples
- Copy functionality for all code blocks
- Proper syntax highlighting
- Multiple language support

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## Customization

### Adding New Sections

1. Add the section to the sidebar navigation in `index.html`
2. Create the section content with proper ID
3. Update the search data in `script.js`
4. Add to the page navigation array if needed

### Modifying Styles

The website uses Tailwind CSS classes throughout. You can:

- Modify the Tailwind config in the `<script>` tag
- Add custom CSS in the `<style>` section
- Update the color scheme by changing CSS custom properties

### Extending Functionality

The JavaScript is modular and well-documented. You can:

- Add new interactive features
- Extend the search functionality
- Implement additional navigation features
- Add more accessibility enhancements

## Credits

- **Next.js** - The React framework this documentation covers
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Prism.js** - Syntax highlighting for code blocks
- **Modern Web Standards** - Built with semantic HTML5, ES6+, and CSS3

## License

This documentation website is provided as-is for educational and reference purposes. Feel free to use, modify, and distribute as needed.

---

Built with ❤️ for the Next.js community
