// server/db.js — SQLite Database Connection & Schema Setup
// Uses better-sqlite3 for synchronous, high-performance SQLite operations.

import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { tasks as seedTasks, projects as seedProjects } from '../src/data/mockData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'taskflow.db')
const db = new Database(dbPath)

// Enable WAL mode (Write-Ahead Logging) for optimal performance and concurrency
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    totalTasks INTEGER DEFAULT 0,
    completedTasks INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT NOT NULL DEFAULT 'medium',
    projectId TEXT,
    dueDate TEXT,
    createdAt TEXT,
    FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE SET NULL
  );
`)

// Seed initial data if tables are empty
function seedDatabase() {
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (id, name, description, color, totalTasks, completedTasks)
      VALUES (@id, @name, @description, @color, @totalTasks, @completedTasks)
    `)
    const insertManyProjects = db.transaction((projs) => {
      for (const p of projs) {
        insertProject.run(p)
      }
    })
    insertManyProjects(seedProjects)
  }

  const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count
  if (taskCount === 0) {
    const insertTask = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, projectId, dueDate, createdAt)
      VALUES (@id, @title, @description, @status, @priority, @projectId, @dueDate, @createdAt)
    `)
    const insertManyTasks = db.transaction((ts) => {
      for (const t of ts) {
        insertTask.run(t)
      }
    })
    insertManyTasks(seedTasks)
  }
}

seedDatabase()

// ── CRUD Helpers ────────────────────────────────────────────────────────────

export function getTasks() {
  return db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all()
}

export function getTaskById(id) {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
}

export function createTask(task) {
  const stmt = db.prepare(`
    INSERT INTO tasks (id, title, description, status, priority, projectId, dueDate, createdAt)
    VALUES (@id, @title, @description, @status, @priority, @projectId, @dueDate, @createdAt)
  `)
  stmt.run({
    id: task.id || `task-${Date.now()}`,
    title: task.title,
    description: task.description || '',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    projectId: task.projectId || null,
    dueDate: task.dueDate || new Date().toISOString().split('T')[0],
    createdAt: task.createdAt || new Date().toISOString().split('T')[0],
  })
  return getTaskById(task.id)
}

export function updateTask(id, fields) {
  const existing = getTaskById(id)
  if (!existing) return null

  const updated = {
    ...existing,
    ...fields,
  }

  const stmt = db.prepare(`
    UPDATE tasks
    SET title = @title,
        description = @description,
        status = @status,
        priority = @priority,
        projectId = @projectId,
        dueDate = @dueDate
    WHERE id = @id
  `)

  stmt.run({
    id,
    title: updated.title,
    description: updated.description || '',
    status: updated.status,
    priority: updated.priority,
    projectId: updated.projectId,
    dueDate: updated.dueDate,
  })

  return getTaskById(id)
}

export function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?')
  const result = stmt.run(id)
  return result.changes > 0
}

export function getProjects() {
  return db.prepare('SELECT * FROM projects').all()
}

export function getProjectById(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
}

export function createProject(project) {
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, description, color, totalTasks, completedTasks)
    VALUES (@id, @name, @description, @color, @totalTasks, @completedTasks)
  `)
  stmt.run({
    id: project.id || `proj-${Date.now()}`,
    name: project.name,
    description: project.description || '',
    color: project.color || '#6366f1',
    totalTasks: project.totalTasks || 0,
    completedTasks: project.completedTasks || 0,
  })
  return getProjectById(project.id)
}

export function resetDatabase() {
  db.exec(`
    DELETE FROM tasks;
    DELETE FROM projects;
  `)
  const insertProject = db.prepare(`
    INSERT INTO projects (id, name, description, color, totalTasks, completedTasks)
    VALUES (@id, @name, @description, @color, @totalTasks, @completedTasks)
  `)
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, description, status, priority, projectId, dueDate, createdAt)
    VALUES (@id, @title, @description, @status, @priority, @projectId, @dueDate, @createdAt)
  `)

  const seedAll = db.transaction(() => {
    for (const p of seedProjects) insertProject.run(p)
    for (const t of seedTasks) insertTask.run(t)
  })
  seedAll()

  return {
    projects: getProjects(),
    tasks: getTasks(),
  }
}

export default db
