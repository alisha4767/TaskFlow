// src/services/api.js — TaskFlow Frontend API Client
// Interfaces with the Express + SQLite backend (/api) with graceful LocalStorage fallback.

const API_BASE = '/api'

// Helper for fetch with timeout & error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

// ── Health Check ─────────────────────────────────────────────────────────────
export async function checkBackendHealth() {
  try {
    const data = await request('/health')
    return { isOnline: data.status === 'ok', ...data }
  } catch (err) {
    return { isOnline: false, error: err.message }
  }
}

// ── Tasks API ────────────────────────────────────────────────────────────────
export async function getTasks() {
  return request('/tasks')
}

export async function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export async function updateTask(id, fields) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  })
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  })
}

// ── Projects API ─────────────────────────────────────────────────────────────
export async function getProjects() {
  return request('/projects')
}

export async function createProject(project) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  })
}

// ── Reset Database API ───────────────────────────────────────────────────────
export async function resetDatabase() {
  return request('/reset', {
    method: 'POST',
  })
}
