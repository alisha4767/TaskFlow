// main.jsx — The ENTRY POINT of our React application.
// This is the very first JavaScript file that runs.
// Its single job: mount (attach) our React app into the HTML page.

// StrictMode is a React development tool.
// It intentionally runs some things twice to help you catch bugs early.
// It has NO effect in production — it's only active during development.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
