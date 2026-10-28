// server/index.js — Express REST API Server for TaskFlow
// Provides complete CRUD endpoints backed by SQLite.

import express from 'express'
import cors from 'cors'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getProjects,
  getProjectById,
  createProject,
  resetDatabase,
} from './db.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Request logger for API calls
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`)
  })
  next()
})

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TaskFlow REST API',
  })
})

// ── Tasks Endpoints ──────────────────────────────────────────────────────────

// GET all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = getTasks()
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message })
  }
})

// GET single task by id
app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = getTaskById(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task', details: err.message })
  }
})

// POST create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, status, priority, projectId, dueDate, createdAt } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const newTask = createTask({
      id: req.body.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      projectId: projectId || null,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      createdAt: createdAt || new Date().toISOString().split('T')[0],
    })

    res.status(201).json(newTask)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task', details: err.message })
  }
})

// PATCH / PUT update a task
const handleUpdate = (req, res) => {
  try {
    const id = req.params.id
    const updated = updateTask(id, req.body)
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', details: err.message })
  }
}

app.patch('/api/tasks/:id', handleUpdate)
app.put('/api/tasks/:id', handleUpdate)

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const id = req.params.id
    const success = deleteTask(id)
    if (!success) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json({ success: true, id })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err.message })
  }
})

// ── Projects Endpoints ───────────────────────────────────────────────────────

// GET all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = getProjects()
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message })
  }
})

// GET single project by id
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = getProjectById(req.params.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project', details: err.message })
  }
})

// POST create a new project
app.post('/api/projects', (req, res) => {
  try {
    const { name, description, color } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' })
    }

    const newProject = createProject({
      id: req.body.id || `proj-${Date.now()}`,
      name: name.trim(),
      description: description || '',
      color: color || '#6366f1',
    })

    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project', details: err.message })
  }
})

// ── Database Reset Endpoint ─────────────────────────────────────────────────
app.post('/api/reset', (req, res) => {
  try {
    const data = resetDatabase()
    res.json({ success: true, message: 'Database reset to default seed data', ...data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset database', details: err.message })
  }
})

// ── Start Server ────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Backend running at http://localhost:${PORT}`)
})

export default server
