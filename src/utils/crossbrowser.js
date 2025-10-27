// crossbrowser.js
const browser = window.browser || window.chrome || {}; // Fallback to empty object if neither is available


// Browser detection (can be useful if needed)
const crossbrowserName = window.browser ? 'firefox' : (window.chrome ? 'chrome' : 'unknown');

// Export the variables to use in other files if needed
export { browser, crossbrowserName };
