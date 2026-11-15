import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useTheme } from '../context/ThemeContext'

export default function Layout() {
  const { darkMode } = useTheme()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-space-900' : 'bg-gray-50'}`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
