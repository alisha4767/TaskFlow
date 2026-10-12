// Topbar.jsx
// The fixed top navigation bar of TaskFlow.
// It shows the current page title, search, notifications, and user info.
//
// NEW CONCEPTS IN THIS FILE:
//   1. Receiving props in a component ({ pageTitle })
//   2. Using props to render dynamic content
//   3. Composition — combining multiple small UI elements in one component

import { Search, Bell, Sun } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Topbar
//
// Props received:
//   pageTitle → string: the name of the current page (e.g. "Dashboard")
//
// Why pass pageTitle as a prop instead of hardcoding it?
// Because this same Topbar will be used on EVERY page — Dashboard, Tasks,
// Projects, etc. The title needs to change depending on which page we're on.
// Props let us reuse the same component with different data.
// ─────────────────────────────────────────────────────────────────────────────
function Topbar({ pageTitle }) {
  return (
    // sticky top-0 → stays at the top of the screen as you scroll content
    // z-10 → sits above the content (lower z-index than sidebar's z-20)
    // backdrop-blur-sm → slight blur effect on the background (glassmorphism)
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10 flex items-center justify-between px-6 shrink-0">

      {/* ── Left Side: Page Title ─────────────────────────────────── */}
      <div>
        {/* The pageTitle prop is rendered here.
            If no pageTitle is passed, we fall back to 'Dashboard' using
            the || operator: (pageTitle || 'Dashboard') */}
        <h1 className="text-[15px] font-semibold text-gray-900">
          {pageTitle || 'Dashboard'}
        </h1>
        {/* A subtle breadcrumb-style subtitle */}
        <p className="text-xs text-gray-400 mt-0.5">
          Welcome back, Alisha 👋
        </p>
      </div>

      {/* ── Right Side: Actions ───────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Search button — will open a search modal in a future milestone */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
          title="Search"
        >
          <Search size={15} />
          <span className="hidden sm:inline text-xs">Search...</span>
          {/* hidden sm:inline → hide on mobile, show on sm screens and up */}
          <kbd className="hidden sm:inline text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle — will switch light/dark mode in Milestone 6 */}
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Toggle theme"
        >
          <Sun size={18} />
        </button>

        {/* Notification bell */}
        <button
          type="button"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Notifications"
        >
          <Bell size={18} />
          {/* Notification dot — small red circle to indicate unread items */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
        </button>

        {/* Vertical divider line */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User avatar */}
        <button
          type="button"
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          title="User menu"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">AS</span>
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">Alisha</span>
        </button>

      </div>
    </header>
  )
}

export default Topbar
