// Sidebar.jsx
// The left navigation panel of TaskFlow with collapsible support.

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare2,
  FolderKanban,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

const mainNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare2,    href: '/tasks'     },
  { id: 'projects',  label: 'Projects',  icon: FolderKanban,    href: '/projects'  },
  { id: 'analytics', label: 'Analytics', icon: BarChart3,       href: '/analytics' },
]

const otherNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
]

function NavItem({ icon: Icon, label, href, isCollapsed }) {
  return (
    <li>
      <NavLink
        to={href}
        end={href === '/'}
        title={isCollapsed ? label : undefined}
        className={({ isActive }) => `
          flex items-center rounded-xl text-sm font-medium transition-all duration-150 group
          ${isCollapsed ? 'justify-center p-2.5 mx-auto' : 'gap-3 px-3 py-2.5'}
          ${isActive
            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          }
        `}
      >
        {({ isActive }) => (
          <>
            <Icon
              size={18}
              className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'} shrink-0`}
            />
            {!isCollapsed && <span className="truncate">{label}</span>}
            {!isCollapsed && isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
            )}
          </>
        )}
      </NavLink>
    </li>
  )
}

function Sidebar({ isCollapsed, onToggleCollapse }) {
  return (
    <aside
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 fixed left-0 top-0 flex flex-col z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* ── Brand Logo & Collapse Toggle Button ───────────────────── */}
      <div
        className={`flex items-center h-16 border-b border-gray-100 dark:border-gray-800 shrink-0 ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {!isCollapsed ? (
          <>
            <NavLink to="/" className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-sm shrink-0">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-[15px] font-bold text-gray-900 dark:text-white tracking-tight truncate">
                TaskFlow
              </span>
            </NavLink>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'}`}>
        {/* Main Menu */}
        <div className="mb-6">
          {!isCollapsed ? (
            <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Main Menu
            </p>
          ) : (
            <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
          )}
          <ul className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>

        {/* Other */}
        <div>
          {!isCollapsed ? (
            <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Other
            </p>
          ) : (
            <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
          )}
          <ul className="space-y-0.5">
            {otherNavItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* ── User Profile Footer ───────────────────────────────────── */}
      <div className={`shrink-0 border-t border-gray-100 dark:border-gray-800 ${isCollapsed ? 'p-2' : 'px-3 py-4'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">AS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Alisha Shakir</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Free Plan</p>
            </div>
            <LogOut size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0" />
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-2 cursor-pointer group"
            title="Alisha Shakir (Free Plan)"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xs">
              <span className="text-xs font-bold text-white">AS</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
