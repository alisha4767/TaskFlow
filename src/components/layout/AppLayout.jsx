// AppLayout.jsx
// The master layout component — assembles Sidebar, Topbar, and the main content.
//
// NEW CONCEPT: The 'children' prop
//
// When you write:
//   <AppLayout>
//     <SomeComponent />
//   </AppLayout>
//
// React automatically passes <SomeComponent /> as 'props.children' to AppLayout.
// This lets AppLayout be a reusable WRAPPER — the same shell works for any page,
// because the page's unique content is passed in via children.

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const titleMap = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/projects': 'Projects',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: AppLayout
//
// Props received:
//   children      → whatever is nested between <AppLayout>...</AppLayout> tags
//   pageTitle     → optional override for the current page name
//   onOpenNewTask → passed down to Topbar for the '+ New Task' button
// ─────────────────────────────────────────────────────────────────────────────
function AppLayout({ children, pageTitle, onOpenNewTask }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_sidebar_collapsed')
      return saved !== null ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('taskflow_sidebar_collapsed', JSON.stringify(isSidebarCollapsed))
    } catch {
      // ignore
    }
  }, [isSidebarCollapsed])

  const location = useLocation()
  const displayTitle = pageTitle || titleMap[location.pathname] || 'Dashboard'

  function handleToggleSidebar() {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Topbar
          pageTitle={displayTitle}
          onOpenNewTask={onOpenNewTask}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main content area — this is where each page's content appears */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
