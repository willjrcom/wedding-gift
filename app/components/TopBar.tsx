'use client'


import Link from 'next/link'

export default function TopBar({
  title,
  backHref,
  right,
  spacer = true
}: {
  title: string
  backHref?: string
  right?: React.ReactNode
  spacer?: boolean
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-background-light/95 backdrop-blur-md border-b border-gray-200/50">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        {backHref ? (
          <Link
            href={backHref}
            className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center active:scale-[0.98] transition"
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </Link>
        ) : (
          <div className="w-10" />
        )}

        <h1 className="text-lg font-bold tracking-tight">{title}</h1>

        {right ? <div className="w-10 flex justify-end">{right}</div> : spacer ? <div className="w-10" /> : null}
      </div>
    </header>
  )
}
