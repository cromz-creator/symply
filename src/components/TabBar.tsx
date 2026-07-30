import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const tabs = [
  { to: '/info', key: 'info', icon: 'ℹ️' },
  { to: '/foods', key: 'foods', icon: '🍎' },
  { to: '/diary', key: 'diary', icon: '📓' },
  { to: '/references', key: 'references', icon: '📚' },
  { to: '/settings', key: 'settings', icon: '⚙️' },
] as const

export default function TabBar() {
  const { t } = useTranslation()
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-xs ${
                  isActive ? 'text-brand' : 'text-slate-500'
                }`
              }
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span>{t(`nav.${tab.key}`)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
