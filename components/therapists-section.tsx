'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TherapistCard } from './therapist-card'

const ITEMS_POR_PAGINA = 12

export function TherapistsSection({ searchQuery }: { searchQuery: string }) {
  const [therapists, setTherapists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    carregarTerapeutas()
  }, [])

  const carregarTerapeutas = async () => {
    // Busca e ordena pela coluna "ordem" definida no admin
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'ativo')
      .order('ordem', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar:', error)
      setLoading(false)
      return
    }

    const hoje = new Date()
    const filtrados = data.filter((t: any) => {
      if (!t.data_expiracao) return true
      return new Date(t.data_expiracao) > hoje
    })

    setTherapists(filtrados)
    setLoading(false)
  }

  if (loading) return <p className="text-center py-20 text-emerald-700 animate-pulse font-medium">Carregando especialistas...</p>

  const terapeutasExibidos = therapists.filter((t) =>
    t.nome?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Lógica de Paginação
  const totalPaginas = Math.ceil(terapeutasExibidos.length / ITEMS_POR_PAGINA)
  const inicioIndex = (paginaAtual - 1) * ITEMS_POR_PAGINA
  const terapeutasPaginados = terapeutasExibidos.slice(inicioIndex, inicioIndex + ITEMS_POR_PAGINA)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      {terapeutasExibidos.length > 0 ? (
        <>
          {/* Grid responsivo: 1 no Mobile, 2 no Tablet, 3 Laptop menor, 4 no Desktop largo */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {terapeutasPaginados.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>

          {/* Botões de Paginação */}
          {totalPaginas > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button 
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 disabled:opacity-50 hover:bg-emerald-50 transition"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPaginaAtual(num)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    paginaAtual === num 
                    ? 'bg-emerald-600 text-white' 
                    : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button 
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 disabled:opacity-50 hover:bg-emerald-50 transition"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-stone-500 py-10">Nenhum especialista encontrado para esta busca.</p>
      )}
    </section>
  )
}