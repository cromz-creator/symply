import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function PageHeader({
  title,
  back = false,
  action,
}: {
  title: string
  back?: boolean
  action?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="pt-safe sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="-ml-1 rounded-lg p-1 text-slate-500 active:bg-slate-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <h1 className="flex-1 truncate text-lg font-semibold text-slate-900">
          {title}
        </h1>
        {action}
      </div>
    </header>
  )
}
