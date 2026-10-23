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

function SettingsPage({ tasks, onResetData }) {
  const [name, setName] = useState('Alisha Shakir')
  const [email, setEmail] = useState('alisha.shakir@taskflow.dev')
  const [role, setRole] = useState('Frontend Engineer & Product Designer')
  const [theme, setTheme] = useState('light')
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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Account & Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your personal profile, notification preferences, and workspace data.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold animate-fade-in">
            <Check size={14} />
            <span>Changes saved!</span>
          </div>
        )}
      </div>

      {/* ── Profile Section ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <User size={18} className="text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-xs">
              AS
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{name}</p>
              <p className="text-xs text-gray-400">Profile avatar generated from initials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Role / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
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
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Palette size={18} className="text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Appearance & Theme</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun, desc: 'Clean bright layout' },
            { id: 'dark', label: 'Dark', icon: Moon, desc: 'Coming in Milestone 6' },
            { id: 'system', label: 'System', icon: Laptop, desc: 'Matches OS settings' },
          ].map((item) => {
            const Icon = item.icon
            const isSelected = theme === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-indigo-600' : 'text-gray-500'} />
                <p className="text-xs font-bold text-gray-900 mt-2">{item.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Notifications ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Bell size={18} className="text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
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
              title: 'Weekly Productivity Digest',
              desc: 'Get a summary report of your weekly sprint progress every Monday',
            },
            {
              id: 'soundEffects',
              title: 'Completion Sound Chimes',
              desc: 'Play a subtle audio tone when marking tasks as finished',
            },
          ].map((n) => (
            <label
              key={n.id}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 cursor-pointer"
            >
              <div>
                <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{n.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[n.id]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [n.id]: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ── Workspace Data Management ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Database size={18} className="text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Workspace Data Management</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-gray-900">Export TaskFlow Data</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Download your current active tasks and project statuses as a JSON file.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-rose-50/40 border border-rose-100 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-rose-900">Reset Sample Data</p>
            <p className="text-[11px] text-rose-600 mt-0.5">
              Restore the initial mock tasks and project statuses to default.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw size={14} />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
