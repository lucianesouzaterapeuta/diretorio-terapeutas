'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [terapeutas, setTerapeutas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [meses, setMeses] = useState<Record<string, number>>({})
  
  // ESTADOS DO MODAL DE EDIÇÃO COMPLETA
  const [editingTherapist, setEditingTherapist] = useState<any | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editDescricao, setEditDescricao] = useState('')
  const [editWhatsapp, setEditWhatsapp] = useState('')
  const [editInstagram, setEditInstagram] = useState('')
  const [editWebsite, setEditWebsite] = useState('')
  const [editLinkEntrevista, setEditLinkEntrevista] = useState('')
  const [editFotoUrl, setEditFotoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [salvandoPerfil, setSalvandoPerfil] = useState(false)
  const [enviandoEmailId, setEnviandoEmailId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => { carregarDados() }, [])

  const carregarDados = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'lucianesouzaterapeuta@gmail.com') {
      router.push('/login')
      return
    }
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('ordem', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      
    if (data) {
      setTerapeutas(data)
    }
    setLoading(false)
  }

  const handleMesesChange = (id: string, valor: number) => {
    setMeses(prev => ({ ...prev, [id]: valor }))
  }

  // FUNÇÃO PARA ENVIAR O LEMBRETE MANUALMENTE POR E-MAIL COM O LINK DA HOTMART
  const enviarLembreteManual = async (id: string, nome: string) => {
    if (!confirm(`Deseja enviar agora o e-mail de lembrete com o link da Hotmart para ${nome}?`)) return
    
    try {
      setEnviandoEmailId(id)
      const res = await fetch('/api/enviar-lembretes-automaticos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ therapistId: id })
      })
      const data = await res.json()
      if (data.success) {
        alert(`E-mail de lembrete enviado com sucesso para ${nome}!`)
      } else {
        alert(`Erro ao enviar e-mail: ${data.error || 'Erro desconhecido'}`)
      }
    } catch (err: any) {
      alert(`Erro de rede ao tentar enviar e-mail: ${err.message}`)
    } finally {
      setEnviandoEmailId(null)
    }
  }

  // ABRIR O MODAL PREENCHIDO COM OS DADOS DO CLIENTE
  const abrirEditor = (t: any) => {
    setEditingTherapist(t)
    setEditNome(t.nome || '')
    setEditDescricao(t.descricao || '')
    setEditWhatsapp(t.telefone || '')
    setEditInstagram(t.instagram || '')
    setEditWebsite(t.website || '')
    setEditLinkEntrevista(t.link_entrevista || '')
    setEditFotoUrl(t.foto_url || '')
  }

  // UPLOAD DE FOTO DENTRO DO PAINEL ADMIN
  const handleUploadFotoAdmin = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setEditFotoUrl(data.publicUrl)
      alert('Foto alterada com sucesso! Lembre-se de clicar em "Salvar Alterações".')
    } catch (error: any) {
      alert(`Erro ao subir foto: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // SALVAR PERFIL EDITADO NO SUPABASE
  const salvarPerfilEditado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTherapist) return
    setSalvandoPerfil(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        nome: editNome,
        descricao: editDescricao,
        telefone: editWhatsapp,
        instagram: editInstagram,
        website: editWebsite,
        link_entrevista: editLinkEntrevista,
        foto_url: editFotoUrl,
      })
      .eq('id', editingTherapist.id)

    if (error) {
      alert(`Erro ao salvar alterações: ${error.message}`)
    } else {
      alert('Perfil do terapeuta atualizado com sucesso!')
      setTerapeutas(terapeutas.map(t => t.id === editingTherapist.id ? {
        ...t,
        nome: editNome,
        descricao: editDescricao,
        telefone: editWhatsapp,
        instagram: editInstagram,
        website: editWebsite,
        link_entrevista: editLinkEntrevista,
        foto_url: editFotoUrl,
      } : t))
      setEditingTherapist(null)
    }
    setSalvandoPerfil(false)
  }

  const alterarStatus = async (id: string, acao: 'ativar' | 'desativar') => {
    if (acao === 'desativar') {
      const { error } = await supabase.from('profiles').update({ status: 'pendente' }).eq('id', id)
      if (!error) setTerapeutas(terapeutas.map(t => t.id === id ? { ...t, status: 'pendente' } : t))
    } else {
      const isNovo = terapeutas.find(t => t.id === id)?.status !== 'ativo'
      const qtdMeses = meses[id] || (isNovo ? 3 : 1)
      
      const dataVencimento = new Date()
      dataVencimento.setMonth(dataVencimento.getMonth() + qtdMeses)

      const dataIso = dataVencimento.toISOString()

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
        alert(`Terapeuta ativado/renovado com sucesso por ${qtdMeses} mês(es)!`)
      }
    }
  }

  const deletarTerapeuta = async (id: string, email: string) => {
    if (email === 'lucianesouzaterapeuta@gmail.com') {
      return alert("Ação bloqueada: Não é possível excluir o perfil da proprietária principal da plataforma.")
    }
    
    if (confirm('Tem certeza que deseja excluir este terapeuta?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (!error) setTerapeutas(terapeutas.filter(t => t.id !== id))
    }
  }

  const atualizarOrdem = async (id: string, ordem: string) => {
    const valor = ordem === '' ? null : parseInt(ordem)
    const { error } = await supabase.from('profiles').update({ ordem: valor }).eq('id', id)
    if (error) {
      alert("Erro ao salvar posição")
    } else {
      setTerapeutas(terapeutas.map(t => t.id === id ? { ...t, ordem: valor } : t))
    }
  }

  if (loading) return <p className="text-center mt-10 text-emerald-700">Carregando painel...</p>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
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
      
      <div className="overflow-x-auto shadow-sm rounded-xl border border-emerald-200/80 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="p-4 text-left w-20 font-semibold">Posição</th>
              <th className="p-4 text-left min-w-[220px] font-semibold">Terapeuta, Contatos e Datas</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center w-52 font-semibold">Ações e Gestão</th>
            </tr>
          </thead>
          <tbody>
            {terapeutas.map((t, index) => (
              <tr 
                key={t.id} 
                className={`border-b border-emerald-200/60 hover:bg-emerald-50/50 transition-colors ${
                  index > 0 ? 'border-t-2 border-t-emerald-100/60' : ''
                }`}
              >
                
                <td className="p-4 align-top">
                  <input 
                    type="number" 
                    placeholder="Nº"
                    defaultValue={t.ordem || ''}
                    onBlur={(e) => atualizarOrdem(t.id, e.target.value)}
                    /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                    className="w-16 border border-emerald-300 rounded p-1.5 text-center text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                  />
                </td>

                <td className="p-4 align-top">
                  <div className="font-bold text-emerald-900 text-base">{t.nome}</div>
                  <div className="text-gray-500 text-xs mb-1">{t.email}</div>
                  
                  <div className="text-xs text-emerald-700 font-medium mb-2">
                    {t.telefone ? (
                      <a href={`https://wa.me/${t.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 mt-0.5">
                        <i className="fab fa-whatsapp text-emerald-600" /> {t.telefone}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-[11px]">WhatsApp não informado</span>
                    )}
                  </div>
                  
                  <div className="text-[11px] text-gray-500 flex flex-col gap-0.5 border-l-2 border-emerald-200 pl-2">
                    <p><strong>Cadastrado:</strong> {t.created_at ? new Date(t.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    {t.data_expiracao && (
                      <p className={new Date(t.data_expiracao) < new Date() ? 'text-red-500 font-semibold' : 'text-emerald-600 font-semibold'}>
                        <strong>Vencimento:</strong> {new Date(t.data_expiracao).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </td>

                <td className="p-4 align-top text-center">
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${t.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {t.status}
                   </span>
                </td>
                
                <td className="p-4 align-top">
                  <div className="flex flex-col gap-2">
                    
                    {/* BOTÃO PARA ABRIR O EDITOR COMPLETO DO PERFIL */}
                    <button 
                      onClick={() => abrirEditor(t)} 
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-md text-xs transition w-full font-medium flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <i className="fa-solid fa-pen-to-square" /> Editar Perfil Completo
                    </button>

                    {/* BOTÃO PARA ENVIAR O LEMBRETE MANUAL COM LINK DA HOTMART */}
                    <button 
                      onClick={() => enviarLembreteManual(t.id, t.nome)}
                      disabled={enviandoEmailId === t.id}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-xs transition w-full font-medium flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <i className="fa-solid fa-envelope" /> {enviandoEmailId === t.id ? 'A enviar...' : 'Enviar Lembrete'}
                    </button>

                    <div className="border-t border-emerald-200/60 my-1"></div>

                    {t.status !== 'ativo' ? (
                      <>
                        <select 
                          /* ADICIONADO text-slate-900 ABAIXO */
                          className="w-full border border-emerald-300 rounded p-1.5 text-xs bg-white outline-none text-slate-900"
                          value={meses[t.id] || 3}
                          onChange={(e) => handleMesesChange(t.id, parseInt(e.target.value))}
                        >
                          <option value={1}>1 Mês Grátis</option>
                          <option value={3}>3 Meses Grátis (Trial)</option>
                          <option value={6}>6 Meses Grátis</option>
                          <option value={12}>12 Meses Grátis</option>
                        </select>
                        <button onClick={() => alterarStatus(t.id, 'ativar')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-xs transition w-full font-medium">
                          Aprovar / Ativar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => alterarStatus(t.id, 'desativar')} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md text-xs transition w-full font-medium mb-1">
                          Suspender Perfil
                        </button>
                        <select 
                          /* ADICIONADO text-slate-900 ABAIXO */
                          className="w-full border border-blue-300 rounded p-1.5 text-xs bg-white outline-none text-slate-900"
                          value={meses[t.id] || 1}
                          onChange={(e) => handleMesesChange(t.id, parseInt(e.target.value))}
                        >
                          <option value={1}>Renovar +1 Mês</option>
                          <option value={3}>Renovar +3 Meses</option>
                          <option value={6}>Renovar +6 Meses</option>
                          <option value={12}>Renovar +1 Ano</option>
                        </select>
                        <button onClick={() => alterarStatus(t.id, 'ativar')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs transition w-full font-medium">
                          Lançar Pagamento
                        </button>
                      </>
                    )}

                    <div className="border-t border-emerald-200/60 my-1"></div>
                    <button onClick={() => deletarTerapeuta(t.id, t.email)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs transition w-full">
                      Excluir Conta
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDIÇÃO COMPLETA DO PERFIL */}
      {editingTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-emerald-900">Editar Perfil: {editingTherapist.nome}</h2>
              <button 
                onClick={() => setEditingTherapist(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={salvarPerfilEditado} className="space-y-4">
              
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-md bg-slate-50">
                <div className="h-32 w-24 bg-slate-200 mb-2 flex items-center justify-center text-slate-400 rounded-md shadow-sm border border-slate-300 overflow-hidden bg-cover bg-center" style={{ backgroundImage: editFotoUrl ? `url(${editFotoUrl})` : 'none' }}>
                   {!editFotoUrl && 'Sem Foto'}
                </div>
                <div className="relative">
                  <button type="button" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                    {uploading ? 'Enviando foto...' : 'Alterar Foto de Perfil'}
                  </button>
                  <input type="file" accept="image/*" onChange={handleUploadFotoAdmin} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nome Profissional</label>
                <input 
                  type="text" 
                  required 
                  value={editNome} 
                  onChange={(e) => setEditNome(e.target.value)} 
                  /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Sobre mim (Bio)</label>
                <textarea 
                  rows={4} 
                  required 
                  value={editDescricao} 
                  onChange={(e) => setEditDescricao(e.target.value)} 
                  /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">WhatsApp</label>
                <input 
                  type="text" 
                  required 
                  value={editWhatsapp} 
                  onChange={(e) => setEditWhatsapp(e.target.value)} 
                  /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Instagram</label>
                <input 
                  type="text" 
                  value={editInstagram} 
                  onChange={(e) => setEditInstagram(e.target.value)} 
                  /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Site</label>
                <input 
                  type="url" 
                  value={editWebsite} 
                  onChange={(e) => setEditWebsite(e.target.value)} 
                  /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Link da Entrevista (YouTube / Podcast)</label>
                <input 
                  type="url" 
                  value={editLinkEntrevista} 
                  onChange={(e) => setEditLinkEntrevista(e.target.value)} 
                  placeholder="Ex: https://youtu.be/..." 
                  /* ADICIONADO text-slate-900 e bg-white ABAIXO */
                  className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-600 outline-none text-slate-900 bg-white" 
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setEditingTherapist(null)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-2.5 rounded-lg font-medium text-sm transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={salvandoPerfil || uploading} 
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-lg font-medium text-sm transition shadow-sm disabled:opacity-50"
                >
                  {salvandoPerfil ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}