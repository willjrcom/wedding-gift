'use client'


export default function PillButton({
  children,
  variant = 'primary',
  onClick,
  type = 'button'
}: {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'outline'
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const cls =
    variant === 'primary'
      ? 'bg-primary text-white shadow-soft'
      : variant === 'outline'
      ? 'bg-white text-slate-900 border border-gray-200 shadow-soft'
      : 'bg-white text-slate-900'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${cls} w-full rounded-full py-4 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.99] transition`}
    >
      {children}
    </button>
  )
}
