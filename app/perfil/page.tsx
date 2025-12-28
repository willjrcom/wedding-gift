import { Suspense } from 'react'
import PerfilClient from './perfil-client'

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <div className="mx-auto max-w-md px-4 pt-20 text-center text-slate-600">Carregando...</div>
        </main>
      }
    >
      <PerfilClient />
    </Suspense>
  )
}
