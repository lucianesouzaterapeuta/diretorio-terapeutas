'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [terapeutas, setTerapeutas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // Novo estado para controlar os meses selecionados de cada terapeuta individualmente
  const [meses, setMeses] = useState<Record<string, number>>({})
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

  // Função para lidar com a mudança do select
  const handleMesesChange = (id: string, valor: number) => {
    setMeses(prev => ({ ...prev, [id]: valor }))
  }

  // Nova função unificada para ativar com meses ou desativar
  const alterarStatus = async (id: string, acao: 'ativar' | 'desativar') => {
    if (acao === 'desativar') {
      const { error } = await supabase.from('profiles').update({ status: 'pendente' }).eq('id', id)
      if (!error) setTerapeutas(terapeutas.map(t => t.id === id ? { ...t, status: 'pendente' } : t))
    } else {
      // Pega os meses selecionados (padrão é 1 se não tiver sido alterado)
      const qtdMeses = meses[id] || 1;
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + qtdMeses);

      const dataIso = dataVencimento.toISOString();

      const { error } = await supabase.from('profiles').update({ 
        status: 'ativo',
        data_expiracao: dataIso
      }).eq('id', id)

      if (!error) {
        setTerapeutas(terapeutas.map(t => t.id === id ? { 
          ...t, 
          status: 'ativo', 
          data_expiracao: dataIso 
        } : t))
        alert(`Terapeuta ativado/renovado com sucesso por ${qtdMeses} mês(es)!`);
      }
    }
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
              <th className="p-3 text-left">Terapeuta e Datas</th>
              <th className="p-3 text-left">WhatsApp</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Ações de Acesso</th>
            </tr>
          </thead>
          <tbody>
            {terapeutas.map((t) => (
              <tr key={t.id} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                
                <td className="p-3 align-top">
                  <input 
                    type="number" 
                    placeholder="Nº"
                    defaultValue={t.ordem || ''}
                    onBlur={(e) => atualizarOrdem(t.id, e.target.value)}
                    className="w-16 border border-emerald-300 rounded p-1.5 text-center text-sm bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </td>

                <td className="p-3 align-top">
                  <div className="font-bold text-emerald-900">{t.nome}</div>
                  <div className="text-gray-500 text-xs mb-2">{t.email}</div>
                  
                  {/* NOVAS INFORMAÇÕES DE DATAS AQUI */}
                  <div className="text-[11px] text-gray-500 flex flex-col gap-0.5 border-l-2 border-emerald-200 pl-2">
                    <p><strong>Cadastrado em:</strong> {t.created_at ? new Date(t.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    {t.data_expiracao && (
                      <p className={new Date(t.data_expiracao) < new Date() ? 'text-red-500 font-semibold' : 'text-emerald-600 font-semibold'}>
                        <strong>Vencimento:</strong> {new Date(t.data_expiracao).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </td>
                
                <td className="p-3 align-top">
                  {t.telefone ? (
                    <a href={`https://wa.me/${t.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 font-medium hover:underline">
                      {t.telefone}
                    </a>
                  ) : <span className="text-gray-400 text-xs">Não informado</span>}
                </td>

                <td className="p-3 align-top">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.status}
                   </span>
                </td>
                
                <td className="p-3 align-top w-40">
                  <div className="flex flex-col gap-1.5">
                    {/* Se estiver pendente, mostra opções para ATIVAR */}
                    {t.status !== 'ativo' ? (
                      <>
                        <select 
                          className="w-full border border-emerald-300 rounded p-1 text-xs bg-white outline-none"
                          value={meses[t.id] || 1}
                          onChange={(e) => handleMesesChange(t.id, parseInt(e.target.value))}
                        >
                          <option value={1}>Libera 1 Mês</option>
                          <option value={2}>Libera 2 Meses</option>
                          <option value={3}>Libera 3 Meses</option>
                          <option value={6}>Libera 6 Meses</option>
                          <option value={12}>Libera 12 Meses</option>
                        </select>
                        <button onClick={() => alterarStatus(t.id, 'ativar')} className="bg-emerald-600 hover:opacity-90 text-white px-3 py-1.5 rounded text-xs transition w-full font-medium">
                          Ativar Perfil
                        </button>
                      </>
                    ) : (
                      /* Se já estiver ativo, mostra botão de desativar E botão de renovar */
                      <>
                        <button onClick={() => alterarStatus(t.id, 'desativar')} className="bg-amber-500 hover:opacity-90 text-white px-3 py-1.5 rounded text-xs transition w-full font-medium mb-1">
                          Desativar Agora
                        </button>
                        <div className="border-t border-gray-100 my-0.5"></div>
                        <select 
                          className="w-full border border-blue-300 rounded p-1 text-xs bg-white outline-none"
                          value={meses[t.id] || 1}
                          onChange={(e) => handleMesesChange(t.id, parseInt(e.target.value))}
                        >
                          <option value={1}>Renova +1 Mês</option>
                          <option value={2}>Renova +2 Meses</option>
                          <option value={3}>Renova +3 Meses</option>
                          <option value={6}>Renova +6 Meses</option>
                          <option value={12}>Renova +12 Meses</option>
                        </select>
                        <button onClick={() => alterarStatus(t.id, 'ativar')} className="bg-blue-600 hover:opacity-90 text-white px-3 py-1.5 rounded text-xs transition w-full font-medium">
                          Renovar Validade
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1 mt-2"></div>
                    <button onClick={() => deletarTerapeuta(t.id, t.email)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs transition w-full">
                      Excluir Conta
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}