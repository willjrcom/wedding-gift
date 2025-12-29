import Link from 'next/link'
import type { ReactNode } from 'react'

export default function TopBar({
  title,
  right,
  backHref
}: {
  title: string
  right?: ReactNode
  backHref?: string
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link href={backHref} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
          ) : null}

          <div className="text-sm font-extrabold text-slate-900">{title}</div>
        </div>

        <div>{right}</div>
      </div>
    </div>
  )
}
