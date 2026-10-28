// CommandPalette.jsx — Global Command Palette & Instant Search (Ctrl+K / Cmd+K)
// Provides quick navigation, search across tasks and projects, and triggerable actions.

import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  CheckSquare2,
  FolderKanban,
  BarChart3,
  Settings,
  Plus,
  Sun,
  Moon,
  Download,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

function CommandPalette({
  isOpen,
  onClose,
  tasks = [],
  projects = [],
  theme = 'light',
  onOpenNewTask,
  onToggleTheme,
  onExportData,
  onResetData,
  onSelectTask,
}) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Core navigation items
  const navItems = useMemo(
    () => [
      { id: 'nav-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation', action: () => navigate('/') },
      { id: 'nav-tasks',     label: 'Go to Tasks',     icon: CheckSquare2,    category: 'Navigation', action: () => navigate('/tasks') },
      { id: 'nav-projects',  label: 'Go to Projects',  icon: FolderKanban,    category: 'Navigation', action: () => navigate('/projects') },
      { id: 'nav-analytics', label: 'Go to Analytics', icon: BarChart3,       category: 'Navigation', action: () => navigate('/analytics') },
      { id: 'nav-settings',  label: 'Go to Settings',  icon: Settings,        category: 'Navigation', action: () => navigate('/settings') },
    ],
    [navigate]
  )

  // Core actions
  const actionItems = useMemo(
    () => [
      {
        id: 'act-new-task',
        label: 'Create New Task',
        shortcut: 'N',
        icon: Plus,
        category: 'Actions',
        action: () => {
          onClose()
          if (onOpenNewTask) onOpenNewTask('todo')
        },
      },
      {
        id: 'act-toggle-theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        shortcut: 'T',
        icon: theme === 'dark' ? Sun : Moon,
        category: 'Actions',
        action: () => {
          if (onToggleTheme) onToggleTheme()
          onClose()
        },
      },
      {
        id: 'act-export',
        label: 'Export Workspace Data (JSON)',
        icon: Download,
        category: 'Actions',
        action: () => {
          if (onExportData) onExportData()
          onClose()
        },
      },
      {
        id: 'act-reset',
        label: 'Reset to Sample Data',
        icon: RotateCcw,
        category: 'Actions',
        action: () => {
          if (onResetData) onResetData()
          onClose()
        },
      },
    ],
    [theme, onClose, onOpenNewTask, onToggleTheme, onExportData, onResetData]
  )

  // Filter tasks & projects based on query
  const matchingTasks = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return tasks
      .filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
      .slice(0, 5)
      .map((t) => ({
        id: `task-${t.id}`,
        label: t.title,
        sub: t.description || `Due: ${t.dueDate}`,
        icon: CheckSquare2,
        category: 'Tasks',
        badge: t.status,
        action: () => {
          onClose()
          navigate('/tasks')
          if (onSelectTask) onSelectTask(t)
        },
      }))
  }, [query, tasks, navigate, onClose, onSelectTask])

  const matchingProjects = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return projects
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({
        id: `proj-${p.id}`,
        label: p.name,
        sub: `${tasks.filter((t) => t.projectId === p.id).length} tasks`,
        icon: FolderKanban,
        category: 'Projects',
        color: p.color,
        action: () => {
          onClose()
          navigate('/projects')
        },
      }))
  }, [query, projects, tasks, navigate, onClose])

  // All visible items combined
  const allFilteredItems = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) {
      return [...actionItems, ...navItems]
    }

    const filteredActions = actionItems.filter((item) =>
      item.label.toLowerCase().includes(q)
    )
    const filteredNav = navItems.filter((item) =>
      item.label.toLowerCase().includes(q)
    )

    return [...matchingTasks, ...matchingProjects, ...filteredActions, ...filteredNav]
  }, [query, actionItems, navItems, matchingTasks, matchingProjects])

  function handleQueryChange(e) {
    setQuery(e.target.value)
    setSelectedIndex(0)
  }

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (allFilteredItems.length || 1))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev <= 0 ? allFilteredItems.length - 1 : prev - 1
        )
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const selected = allFilteredItems[selectedIndex]
        if (selected) {
          selected.action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, allFilteredItems, selectedIndex])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-gray-900/60 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[540px] animate-fade-in">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <Search size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Type a command or search tasks, projects..."
            className="w-full text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
          {allFilteredItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500">
              <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Try searching for a different keyword or command</p>
            </div>
          ) : (
            allFilteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              const Icon = item.icon

              return (
                <div
                  key={item.id}
                  data-selected={isSelected}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                      style={item.color ? { backgroundColor: item.color, color: '#fff' } : undefined}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${
                        isSelected
                          ? 'text-indigo-950 dark:text-indigo-100 font-semibold'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {item.label}
                      </p>
                      {item.sub && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Meta / Shortcut */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {item.category}
                    </span>

                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                        {item.shortcut}
                      </kbd>
                    )}

                    {isSelected && (
                      <ArrowRight size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-950/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-semibold text-gray-600 dark:text-gray-300">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-semibold text-gray-600 dark:text-gray-300">↵</kbd> to select
            </span>
            <span>
              <kbd className="font-semibold text-gray-600 dark:text-gray-300">esc</kbd> to close
            </span>
          </div>
          <span>TaskFlow Command Palette</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
