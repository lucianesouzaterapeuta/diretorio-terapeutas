'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [terapeutas, setTerapeutas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { carregarDados() }, [])

  const carregarDados = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'lucianesouzaterapeuta@gmail.com') {
      router.push('/login')
      return
    }
    
    // Busca os dados ordenando pela coluna de posição numérica
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('ordem', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      
    if (data) setTerapeutas(data)
    setLoading(false)
  }

  const alternarStatus = async (id: string, status: string) => {
    const novoStatus = status === 'ativo' ? 'pendente' : 'ativo'
    const { error } = await supabase.from('profiles').update({ status: novoStatus }).eq('id', id)
    if (!error) setTerapeutas(terapeutas.map(t => t.id === id ? { ...t, status: novoStatus } : t))
  }

  const deletarTerapeuta = async (id: string, email: string) => {
    // Nova trava de segurança baseada no e-mail (impossível de falhar)
    if (email === 'lucianesouzaterapeuta@gmail.com') {
      return alert("Ação bloqueada: Não é possível excluir o perfil da proprietária principal da plataforma.");
    }
    
    if (confirm('Tem certeza que deseja excluir este terapeuta?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (!error) setTerapeutas(terapeutas.filter(t => t.id !== id))
    }
  }

  const atualizarOrdem = async (id: string, ordem: string) => {
    const valor = ordem === '' ? null : parseInt(ordem);
    const { error } = await supabase.from('profiles').update({ ordem: valor }).eq('id', id)
    if (error) {
      alert("Erro ao salvar posição");
    } else {
      setTerapeutas(terapeutas.map(t => t.id === id ? { ...t, ordem: valor } : t));
    }
  }

  if (loading) return <p className="text-center mt-10 text-emerald-700">Carregando painel...</p>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* CABEÇALHO COM O NOVO BOTÃO DE EDIÇÃO APONTANDO PARA /perfil */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-emerald-800">Painel da Proprietária</h1>
        
        <Link 
          href="/editar-perfil" 
          className="bg-white border border-emerald-500 text-emerald-700 px-5 py-2.5 rounded-lg hover:bg-emerald-50 transition shadow-sm font-medium text-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-user-pen" aria-hidden="true" />
          Editar Meu Perfil Terapêutico
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg text-sm overflow-hidden">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="p-3 text-left w-20">Posição</th>
              <th className="p-3 text-left">Terapeuta</th>
              <th className="p-3 text-left">WhatsApp</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {terapeutas.map((t) => (
              <tr key={t.id} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                
                <td className="p-3">
                  <input 
                    type="number" 
                    placeholder="Nº"
                    defaultValue={t.ordem || ''}
                    onBlur={(e) => atualizarOrdem(t.id, e.target.value)}
                    className="w-16 border border-emerald-300 rounded p-1.5 text-center text-sm bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </td>

                <td className="p-3">
                  <div className="font-bold text-emerald-900">{t.nome}</div>
                  <div className="text-gray-500 text-xs">{t.email}</div>
                </td>
                
                <td className="p-3">
                  {t.telefone ? (
                    <a href={`https://wa.me/${t.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-medium hover:underline">
                      {t.telefone}
                    </a>
                  ) : <span className="text-gray-400 text-xs">Não informado</span>}
                </td>

                <td className="p-3">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.status}
                   </span>
                </td>
                
                <td className="p-3 flex justify-center gap-2">
                  <button onClick={() => alternarStatus(t.id, t.status)} className={`${t.status === 'ativo' ? 'bg-amber-500' : 'bg-emerald-600'} hover:opacity-90 text-white px-3 py-1 rounded text-xs transition`}>
                    {t.status === 'ativo' ? 'Desativar' : 'Ativar'}
                  </button>
                  <button onClick={() => deletarTerapeuta(t.id, t.email)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}