// main.jsx — The ENTRY POINT of our React application.
// This is the very first JavaScript file that runs.
// Its single job: mount (attach) our React app into the HTML page.

// StrictMode is a React development tool.
// It intentionally runs some things twice to help you catch bugs early.
// It has NO effect in production — it's only active during development.
import { StrictMode } from 'react'

// createRoot is the modern React 18+ way to start a React app.
// It takes a DOM element and gives us a "root" to render into.
import { createRoot } from 'react-dom/client'

// Import our global CSS file. This one import applies styles to the ENTIRE app.
// (The import path './index.css' means: look in the same folder as this file)
import './index.css'

// Import our root App component. The './' means "same folder as this file".
// The '.jsx' extension is optional in Vite, but we include it for clarity.
import App from './App.jsx'

// document.getElementById('root') → finds the <div id="root"> in index.html
// createRoot(...)                  → tells React to take control of that div
// .render(...)                     → renders our React component tree into it
//
// <StrictMode>   → wraps App in the strict mode checker
//   <App />      → our root component (everything starts here)
// </StrictMode>
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
