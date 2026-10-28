// SettingsPage.jsx — Profile, Preferences & Workspace Management

import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Database,
  Download,
  RotateCcw,
  Check,
  Laptop,
  Sun,
  Moon,
} from 'lucide-react'

function SettingsPage({
  tasks = [],
  theme = 'light',
  onSelectTheme,
  onResetData,
}) {
  const [name, setName] = useState('Alisha Shakir')
  const [email, setEmail] = useState('alisha.shakir@taskflow.dev')
  const [role, setRole] = useState('Frontend Engineer & Product Designer')
  const [notifications, setNotifications] = useState({
    dueDateAlerts: true,
    weeklyDigest: false,
    soundEffects: true,
  })
  const [isSaved, setIsSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  function handleExportData() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Account & Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your personal profile, notification preferences, and workspace data.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold animate-fade-in">
            <Check size={14} />
            <span>Changes saved!</span>
          </div>
        )}
      </div>

      {/* ── Profile Section ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <User size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-xs">
              AS
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Profile avatar generated from initials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* ── Appearance & Theme ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <Palette size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Appearance & Theme</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun, desc: 'Clean bright layout' },
            { id: 'dark', label: 'Dark', icon: Moon, desc: 'Sleek dark interface' },
            { id: 'system', label: 'System', icon: Laptop, desc: 'Matches OS settings' },
          ].map((item) => {
            const Icon = item.icon
            const isSelected = theme === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTheme && onSelectTheme(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-100 dark:ring-indigo-900'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
                <p className="text-xs font-bold text-gray-900 dark:text-white mt-2">{item.label}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Notifications ────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Notifications</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'dueDateAlerts',
              title: 'Due Date Reminders',
              desc: 'Receive alerts when high priority tasks approach their deadlines',
            },
            {
              id: 'weeklyDigest',
              title: 'Weekly Productivity Summary',
              desc: 'Email summary of tasks completed and milestones accomplished',
            },
            {
              id: 'soundEffects',
              title: 'Audio Micro-interactions',
              desc: 'Play subtle auditory cue when completing tasks or moving cards',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.id]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [item.id]: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Data & Workspace Management ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <Database size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Data & Storage</h3>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your tasks and projects are securely stored in your local browser storage. You can backup your data as JSON or reset to default demo content.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Download size={14} />
            Export Data (JSON)
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all tasks and projects back to sample defaults? Any custom tasks will be erased.')) {
                if (onResetData) {
                  onResetData()
                }
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset to Sample Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
