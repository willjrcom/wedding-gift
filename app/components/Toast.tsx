'use client'


export default function Toast({ show, text }: { show: boolean; text: string }) {
  if (!show) return null
  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-md bg-white shadow-soft border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900">
        {text}
      </div>
    </div>
  )
}
