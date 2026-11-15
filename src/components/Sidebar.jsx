import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, HeartPulse, Brain, Package,
  RadioTower, Activity, AlertTriangle, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', description: 'Mission Overview' },
  { to: '/vitals', icon: HeartPulse, label: 'Vitals Monitor', description: 'Cardiac & Biometrics' },
  { to: '/emotions', icon: Brain, label: 'Mental Health', description: 'Emotion & Cognition' },
  { to: '/supplies', icon: Package, label: 'Supply Tracker', description: 'ECLSS & Resources' },
  { to: '/radiation', icon: RadioTower, label: 'Radiation', description: 'Exposure & Dosimetry' },
  { to: '/activity', icon: Activity, label: 'Physical Activity', description: 'Exercise & Fitness' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts', description: 'Mission Control Feed' },
  { to: '/nasa-research', icon: BookOpen, label: 'NASA Research', description: 'HRP Standards & Models' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`sticky top-[65px] h-[calc(100vh-65px)] bg-white dark:bg-space-800 border-r border-gray-200 dark:border-space-600 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <div>
                <span className="block">{item.label}</span>
                <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-normal">{item.description}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-gray-200 dark:border-space-600 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Toggle navigation collapse"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  )
}
