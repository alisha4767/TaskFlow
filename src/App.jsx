// App.jsx — Root Application Component
//
// ENHANCEMENTS:
//   1. Full REST API integration with SQLite backend (Express + better-sqlite3)
//   2. Seamless LocalStorage fallback when offline or running standalone
//   3. Command Palette (Ctrl+K / ⌘K) with live search and actions
//   4. Dark Mode system with instant theme switching & persistence
//   5. Task Edit Details Drawer with full field editing & overdue detection
//   6. Global state lifting across all routes

import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import CreateTaskModal from './components/tasks/CreateTaskModal'
import TaskDetailDrawer from './components/tasks/TaskDetailDrawer'
import CommandPalette from './components/common/CommandPalette'
import * as api from './services/api'
import { tasks as initialTasks, projects as initialProjects } from './data/mockData'

function App() {
  // ── 1. The Core Application State with LocalStorage & SQLite Sync ──────────
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks')
      return saved ? JSON.parse(saved) : initialTasks
    } catch {
      return initialTasks
    }
  })

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_projects')
      return saved ? JSON.parse(saved) : initialProjects
    } catch {
      return initialProjects
    }
  })

  const [isBackendConnected, setIsBackendConnected] = useState(false)

  // Initial load: probe backend health and load from SQLite database
  useEffect(() => {
    let isMounted = true

    async function syncWithBackend() {
      try {
        const health = await api.checkBackendHealth()
        if (health.isOnline && isMounted) {
          setIsBackendConnected(true)
          const [dbTasks, dbProjects] = await Promise.all([
            api.getTasks(),
            api.getProjects(),
          ])
          if (isMounted) {
            if (Array.isArray(dbTasks) && dbTasks.length > 0) {
              setTasks(dbTasks)
            }
            if (Array.isArray(dbProjects) && dbProjects.length > 0) {
              setProjects(dbProjects)
            }
          }
        } else if (isMounted) {
          setIsBackendConnected(false)
        }
      } catch (err) {
        if (isMounted) {
          setIsBackendConnected(false)
          console.info('Backend unavailable, running in local storage fallback mode:', err.message)
        }
      }
    }

    syncWithBackend()

    return () => {
      isMounted = false
    }
  }, [])

  // Synchronize tasks to localStorage on change (as cache & fallback)
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err)
    }
  }, [tasks])

  // Synchronize projects to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_projects', JSON.stringify(projects))
    } catch (err) {
      console.error('Failed to save projects to localStorage:', err)
    }
  }, [projects])

  // ── 2. Theme State & Dark Mode Integration ────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_theme')
      if (saved) return saved
    } catch {
      // ignore
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    try {
      localStorage.setItem('taskflow_theme', theme)
    } catch {
      // ignore
    }

    const root = document.documentElement
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  function handleToggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function handleSelectTheme(newTheme) {
    setTheme(newTheme)
  }

  // ── 3. Command Palette State & Global (Ctrl+K / ⌘K) Shortcut ──────────────
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── 4. Task Edit Details Drawer State ─────────────────────────────────────
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)

  function handleSelectTask(task) {
    setSelectedTask(task)
    setIsDetailDrawerOpen(true)
  }

  function handleCloseDetailDrawer() {
    setIsDetailDrawerOpen(false)
  }

  function handleUpdateTask(updatedTask) {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    )
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask)
    }

    if (isBackendConnected) {
      api.updateTask(updatedTask.id, updatedTask).catch((err) => {
        console.warn('API update failed, saved to local cache:', err.message)
      })
    }
  }

  // ── 5. Create Task Modal Open/Close State ──────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialStatus, setModalInitialStatus] = useState('todo')

  function handleOpenModal(initialStatus = 'todo') {
    setModalInitialStatus(typeof initialStatus === 'string' ? initialStatus : 'todo')
    setIsModalOpen(true)
  }

  // ── 6. Handler: Toggle Task Status ─────────────────────────────────────────
  function handleToggleTaskStatus(taskId) {
    let nextStatus = 'todo'
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          nextStatus = task.status === 'completed' ? 'todo' : 'completed'
          const updated = { ...task, status: nextStatus }
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated)
          }
          return updated
        }
        return task
      })
    )

    if (isBackendConnected) {
      api.updateTask(taskId, { status: nextStatus }).catch((err) => {
        console.warn('API update status failed, saved to local cache:', err.message)
      })
    }
  }

  // ── 7. Handler: Direct Update Task Status (For Kanban & dropdowns) ─────────
  function handleUpdateTaskStatus(taskId, newStatus) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updated = { ...task, status: newStatus }
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated)
          }
          return updated
        }
        return task
      })
    )

    if (isBackendConnected) {
      api.updateTask(taskId, { status: newStatus }).catch((err) => {
        console.warn('API update status failed, saved to local cache:', err.message)
      })
    }
  }

  // ── 8. Handler: Add a New Task ─────────────────────────────────────────────
  function handleAddTask(newTask) {
    setTasks((prevTasks) => [newTask, ...prevTasks])

    if (isBackendConnected) {
      api.createTask(newTask).catch((err) => {
        console.warn('API task creation failed, saved to local cache:', err.message)
      })
    }
  }

  // ── 9. Handler: Delete a Task ──────────────────────────────────────────────
  function handleDeleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    if (selectedTask?.id === taskId) {
      setIsDetailDrawerOpen(false)
      setSelectedTask(null)
    }

    if (isBackendConnected) {
      api.deleteTask(taskId).catch((err) => {
        console.warn('API task deletion failed, removed from local cache:', err.message)
      })
    }
  }

  // ── 10. Handler: Reset Data to Defaults ────────────────────────────────────
  async function handleResetData() {
    if (isBackendConnected) {
      try {
        const data = await api.resetDatabase()
        if (data.tasks) setTasks(data.tasks)
        if (data.projects) setProjects(data.projects)
        return
      } catch (err) {
        console.warn('Backend reset failed, resetting local state:', err.message)
      }
    }

    setTasks(initialTasks)
    setProjects(initialProjects)
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(initialTasks))
      localStorage.setItem('taskflow_projects', JSON.stringify(initialProjects))
    } catch (err) {
      console.error('Failed to reset localStorage data:', err)
    }
  }

  // ── 11. Handler: Export Data (JSON) ────────────────────────────────────────
  function handleExportData() {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute(
      'download',
      `taskflow-export-${new Date().toISOString().split('T')[0]}.json`
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <AppLayout
      onOpenNewTask={() => handleOpenModal('todo')}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      theme={theme}
      onToggleTheme={handleToggleTheme}
      isBackendConnected={isBackendConnected}
    >
      <Routes>
        {/* Main Dashboard Route */}
        <Route
          path="/"
          element={
            <Dashboard
              tasks={tasks}
              onToggleTaskStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
              onOpenNewTask={() => handleOpenModal('todo')}
              onSelectTask={handleSelectTask}
            />
          }
        />

        {/* Dashboard alias redirect */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* Dedicated Tasks View */}
        <Route
          path="/tasks"
          element={
            <TasksPage
              tasks={tasks}
              projects={projects}
              onToggleTaskStatus={handleToggleTaskStatus}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              onOpenNewTask={handleOpenModal}
              onSelectTask={handleSelectTask}
            />
          }
        />

        {/* Projects View */}
        <Route
          path="/projects"
          element={
            <ProjectsPage
              projects={projects}
              tasks={tasks}
              onOpenNewTask={() => handleOpenModal('todo')}
            />
          }
        />

        {/* Analytics & Metrics View */}
        <Route
          path="/analytics"
          element={<AnalyticsPage tasks={tasks} projects={projects} />}
        />

        {/* Account & Settings View */}
        <Route
          path="/settings"
          element={
            <SettingsPage
              tasks={tasks}
              theme={theme}
              onSelectTheme={handleSelectTheme}
              onResetData={handleResetData}
              isBackendConnected={isBackendConnected}
            />
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Create Task Modal */}
      <CreateTaskModal
        key={`${modalInitialStatus}-${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        projects={projects}
        defaultStatus={modalInitialStatus}
      />

      {/* Global Task Edit Details Slide-over Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        projects={projects}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleStatus={handleToggleTaskStatus}
      />

      {/* Global Command Palette (Ctrl+K / ⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        projects={projects}
        theme={theme}
        onOpenNewTask={handleOpenModal}
        onToggleTheme={handleToggleTheme}
        onExportData={handleExportData}
        onResetData={handleResetData}
        onSelectTask={handleSelectTask}
      />
    </AppLayout>
  )
}

export default App
