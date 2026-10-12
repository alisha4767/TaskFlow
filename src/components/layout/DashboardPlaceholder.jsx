// DashboardPlaceholder.jsx
// A temporary placeholder for the Dashboard page content.
// This will be replaced with a full Dashboard in Milestone 3.
//
// Purpose: Keep the app in a WORKING state while we build the shell.
// We never want the app to show a blank white screen.

import { CheckSquare2, FolderKanban, Clock, TrendingUp } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Small data array — a preview of the stats we'll build properly in Milestone 3
// ─────────────────────────────────────────────────────────────────────────────
const previewStats = [
  {
    id: 'tasks',
    label: 'Total Tasks',
    value: '24',
    icon: CheckSquare2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    change: '+3 this week',
  },
  {
    id: 'projects',
    label: 'Active Projects',
    value: '6',
    icon: FolderKanban,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    change: '2 in review',
  },
  {
    id: 'overdue',
    label: 'Due Today',
    value: '5',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    change: '2 overdue',
  },
  {
    id: 'completion',
    label: 'Completion Rate',
    value: '73%',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    change: '+12% vs last week',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: StatCard
// A reusable card that shows a single statistic.
// Receives props: label, value, icon, color, bg, change
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg, change }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {/* Icon container */}
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        {/* Change indicator */}
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
          {change}
        </span>
      </div>

      {/* The main number */}
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {/* The label */}
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: DashboardPlaceholder
// The main export from this file
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPlaceholder() {
  return (
    <div>
      {/* ── Welcome Banner ───────────────────────────────────────── */}
      <div className="mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Good evening, Alisha! 🌙
            </h2>
            <p className="text-indigo-200 text-sm">
              You have <span className="text-white font-semibold">5 tasks</span> due today and{' '}
              <span className="text-white font-semibold">3 upcoming deadlines</span> this week.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="hidden md:flex gap-2 opacity-20">
            <div className="w-16 h-16 rounded-full border-4 border-white" />
            <div className="w-10 h-10 rounded-full border-4 border-white self-end" />
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────── */}
      {/* grid-cols-2 → 2 columns on mobile | lg:grid-cols-4 → 4 on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {previewStats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
            change={stat.change}
          />
        ))}
      </div>

      {/* ── Coming Soon Notice ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
          <TrendingUp size={24} className="text-indigo-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Dashboard content coming in Milestone 3
        </h3>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          We'll build tasks, projects, activity feeds, and real charts here.
          The shell is ready — now we fill it with data!
        </p>
      </div>

    </div>
  )
}

export default DashboardPlaceholder
