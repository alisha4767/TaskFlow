// Topbar.jsx
// The fixed top navigation bar of TaskFlow.
// It shows the current page title, search, backend status, notifications, theme toggle, and user info.

import { useState } from 'react'
import { Search, Bell, Sun, Moon, Plus, PanelLeftOpen, PanelLeftClose, Database } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Topbar
//
// Props received:
//   pageTitle             → string: the name of the current page (e.g. "Dashboard")
//   onOpenNewTask         → function: callback when user clicks '+ New Task' button
//   onToggleSidebar       → function: callback to toggle sidebar collapsed state
//   isSidebarCollapsed    → boolean: whether sidebar is currently collapsed
//   onOpenCommandPalette  → function: callback to open the Ctrl+K command palette
//   theme                 → string: 'light' | 'dark' | 'system'
//   onToggleTheme         → function: callback to toggle dark / light mode
//   isBackendConnected    → boolean: whether connected to Express/SQLite API
// ─────────────────────────────────────────────────────────────────────────────
function Topbar({
  pageTitle,
  onOpenNewTask,
  onToggleSidebar,
  isSidebarCollapsed,
  onOpenCommandPalette,
  theme = 'light',
  onToggleTheme,
  isBackendConnected = false,
}) {
  // Compute a time-of-day greeting using a lazy state initializer
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    return hour < 12 ? 'Good morning'
      : hour < 17 ? 'Good afternoon'
      : 'Good evening'
  })

  const isDark = theme === 'dark'

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">

      {/* ── Left Side: Toggle, Page Title & Backend Status ──────────── */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 -ml-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white">
              {pageTitle || 'Dashboard'}
            </h1>

            {/* Backend connection status pill */}
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isBackendConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
              title={isBackendConnected ? 'Connected to SQLite REST API' : 'Running in LocalStorage fallback mode'}
            >
              <Database size={10} />
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isBackendConnected ? 'SQLite DB' : 'Local Storage'}</span>
            </span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {greeting}, Alisha 👋
          </p>
        </div>
      </div>

      {/* ── Right Side: Actions ───────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* New Task button — opens create task modal */}
        {onOpenNewTask && (
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Create new task"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        )}

        {/* Search button — opens Command Palette */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-700/80 cursor-pointer"
          title="Search or press Ctrl+K"
        >
          <Search size={15} />
          <span className="hidden sm:inline text-xs">Search...</span>
          <kbd className="hidden sm:inline text-[10px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-gray-400 dark:text-gray-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle — switches light/dark mode */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={18} className="text-indigo-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notification bell */}
        <button
          type="button"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title="Notifications"
        >
          <Bell size={18} />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-gray-900" />
        </button>

        {/* Vertical divider line */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

        {/* User avatar */}
        <div
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-default"
          title="User profile"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">AS</span>
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">Alisha</span>
        </div>

      </div>
    </header>
  )
}

export default Topbar
