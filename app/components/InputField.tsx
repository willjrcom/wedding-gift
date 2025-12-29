type SelectOption = { value: string; label: string }

type Props = {
  label?: string
  placeholder?: string
  type?: string
  icon?: string
  value?: string
  onChange?: (v: string) => void
  as?: 'input' | 'textarea' | 'select'
  options?: SelectOption[]
  required?: boolean
  name?: string
  disabled?: boolean
}

export default function InputField({
  label,
  placeholder,
  type = 'text',
  icon,
  value,
  onChange,
  as = 'input',
  options = [],
  required,
  name,
  disabled
}: Props) {
  const showLabel = (label ?? '').trim().length > 0

  const baseClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100'

  const wrapClass =
    'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100'

  const controlProps = {
    name,
    disabled,
    required,
    value: value ?? '',
    onChange: (e: any) => onChange?.(String(e.target.value))
  }

  return (
    <div className="grid gap-2">
      {showLabel ? (
        <div className="flex items-baseline justify-between">
          <div className="text-sm font-semibold text-slate-700">{label}</div>
          {!required ? <div className="text-xs font-semibold text-slate-400">(opcional)</div> : null}
        </div>
      ) : null}

      {as === 'select' ? (
        <select className={baseClass} {...controlProps}>
          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : icon ? (
        <div className={wrapClass}>
          <span className="material-symbols-outlined text-[22px] text-slate-500">{icon}</span>
          {as === 'textarea' ? (
            <textarea
              className="min-h-[90px] w-full bg-transparent text-sm text-slate-900 outline-none"
              placeholder={placeholder}
              {...controlProps}
            />
          ) : (
            <input
              className="w-full bg-transparent text-sm text-slate-900 outline-none"
              placeholder={placeholder}
              type={type}
              {...controlProps}
            />
          )}
        </div>
      ) : as === 'textarea' ? (
        <textarea className={baseClass + ' min-h-[110px]'} placeholder={placeholder} {...controlProps} />
      ) : (
        <input className={baseClass} placeholder={placeholder} type={type} {...controlProps} />
      )}
    </div>
  )
}
