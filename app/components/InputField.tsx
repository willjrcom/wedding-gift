'use client'


export default function InputField({
  label,
  placeholder,
  name,
  type = 'text',
  icon,
  as = 'input',
  required
}: {
  label: string
  placeholder?: string
  name: string
  type?: string
  icon?: string
  as?: 'input' | 'textarea' | 'select'
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-semibold text-slate-900">{label}</label>
        {!required ? <span className="text-xs text-slate-500">(opcional)</span> : null}
      </div>

      <div className="relative">
        {icon ? (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}

        {as === 'textarea' ? (
          <textarea
            name={name}
            placeholder={placeholder}
            required={required}
            className={`w-full min-h-[112px] rounded-2xl bg-white border border-gray-200 px-4 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20 ${
              icon ? 'pl-12' : ''
            }`}
          />
        ) : as === 'select' ? (
          <select
            name={name}
            required={required}
            className={`w-full rounded-2xl bg-white border border-gray-200 px-4 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20 ${
              icon ? 'pl-12' : ''
            }`}
            defaultValue="CPF"
          >
            <option>CPF</option>
            <option>CNPJ</option>
            <option>Email</option>
            <option>Telefone</option>
            <option>Aleatória</option>
          </select>
        ) : (
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-2xl bg-white border border-gray-200 px-4 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20 ${
              icon ? 'pl-12' : ''
            }`}
          />
        )}
      </div>
    </div>
  )
}
