import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, HeartPulse, Wind, Thermometer,
  Moon, RadioTower, Dumbbell, Brain, Smile, Droplets,
  Eye, Home, FileText, AlertTriangle, Database, ChevronLeft, ChevronRight, Settings
} from 'lucide-react'
import { useAstroStore } from '../../store/useAstroStore'

const navGroups = [
  {
    title: 'MISSION',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/crew', icon: Users, label: 'Crew Overview' },
      { to: '/alerts', icon: AlertTriangle, label: 'Alert Center' },
    ]
  },
  {
    title: 'BIOMEDICAL SYSTEMS (12 TABS)',
    items: [
      { to: '/tabs/cardiovascular', icon: HeartPulse, label: 'Cardiovascular' },
      { to: '/tabs/respiratory', icon: Wind, label: 'Respiratory' },
      { to: '/tabs/temperature', icon: Thermometer, label: 'Temperature' },
      { to: '/tabs/sleep', icon: Moon, label: 'Sleep & Circadian' },
      { to: '/tabs/radiation', icon: RadioTower, label: 'Radiation Dosimetry' },
      { to: '/tabs/musculoskeletal', icon: Dumbbell, label: 'Musculoskeletal' },
      { to: '/tabs/neuro-cognitive', icon: Brain, label: 'Neuro & Cognitive' },
      { to: '/tabs/mental-health', icon: Smile, label: 'Mental Health' },
      { to: '/tabs/nutrition', icon: Droplets, label: 'Nutrition & Hydration' },
      { to: '/tabs/fluid-shift', icon: Eye, label: 'Fluid Shift & SANS' },
      { to: '/tabs/habitat', icon: Home, label: 'Habitat ECLSS' },
      { to: '/tabs/medical-log', icon: FileText, label: 'Medical Log & PDF' },
    ]
  },
  {
    title: 'STANDARDS & INFO',
    items: [
      { to: '/sources', icon: Database, label: 'Data Sources & NASA' }
    ]
  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { setSettingsModalOpen } = useAstroStore()

  return (
    <aside
      className={`hidden lg:flex sticky top-[53px] h-[calc(100vh-53px)] bg-white dark:bg-space-900 border-r border-gray-200 dark:border-space-700 transition-all duration-300 flex-col z-30 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!collapsed && (
              <p className="px-2.5 mb-1.5 text-[9px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-1' : ''}`
                  }
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom controls: Settings & Collapse Toggle */}
      <div className="p-2 border-t border-gray-200 dark:border-space-700 space-y-1">
        <button
          onClick={() => setSettingsModalOpen(true)}
          className={`w-full nav-item ${collapsed ? 'justify-center px-1' : ''}`}
          title="Open Application Settings"
        >
          <Settings className="w-4 h-4 text-gray-500" />
          {!collapsed && <span>Settings</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full py-1.5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
