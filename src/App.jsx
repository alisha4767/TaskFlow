// App.jsx — Root Application Component
//
// MILESTONE 5: Multi-Page Navigation with React Router
//
// CONCEPTS TAUGHT IN THIS FILE:
//   1. Routing with React Router (Routes, Route, Navigate)
//   2. Shared State across multiple pages (lifting state up)
//   3. Seamless navigation between Dashboard, Tasks, Projects, Analytics, Settings
//   4. Global modal trigger accessible from any route

import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import CreateTaskModal from './components/tasks/CreateTaskModal'
import { tasks as initialTasks, projects as initialProjects } from './data/mockData'

function App() {
  // ── 1. The Core Application State with LocalStorage Persistence ───────────
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

  // Synchronize tasks to localStorage on change
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

  // ── 2. Modal Open/Close State ──────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialStatus, setModalInitialStatus] = useState('todo')

  function handleOpenModal(initialStatus = 'todo') {
    setModalInitialStatus(typeof initialStatus === 'string' ? initialStatus : 'todo')
    setIsModalOpen(true)
  }

  // ── 3. Handler: Toggle Task Status ─────────────────────────────────────────
  function handleToggleTaskStatus(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === 'completed' ? 'todo' : 'completed'
          return { ...task, status: nextStatus }
        }
        return task
      })
    )
  }

  // ── 4. Handler: Direct Update Task Status (For Kanban & dropdowns) ─────────
  function handleUpdateTaskStatus(taskId, newStatus) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  // ── 5. Handler: Add a New Task ─────────────────────────────────────────────
  function handleAddTask(newTask) {
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  // ── 6. Handler: Delete a Task ──────────────────────────────────────────────
  function handleDeleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  // ── 7. Handler: Reset Data to Defaults ─────────────────────────────────────
  function handleResetData() {
    setTasks(initialTasks)
    setProjects(initialProjects)
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(initialTasks))
      localStorage.setItem('taskflow_projects', JSON.stringify(initialProjects))
    } catch (err) {
      console.error('Failed to reset localStorage data:', err)
    }
  }

  return (
    <AppLayout onOpenNewTask={() => handleOpenModal('todo')}>
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
          element={<SettingsPage tasks={tasks} onResetData={handleResetData} />}
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
    </AppLayout>
  )
}

export default App
