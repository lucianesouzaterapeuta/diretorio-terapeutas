'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { SiteHeader } from '@/components/site-header'

// NOVO: Cole aqui o seu ÚNICO Link de Checkout da Hotmart
const LINK_CHECKOUT_HOTMART = "https://pay.hotmart.com/SEU_LINK_AQUI"

export default function EditarPerfilPage() {
  const [userId, setUserId] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [website, setWebsite] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [linkEntrevista, setLinkEntrevista] = useState('')
  
  // ESTADOS DA COBRANÇA
  const [status, setStatus] = useState('ativo')
  const [diasRestantes, setDiasRestantes] = useState<number | null>(null)

  const [isAdmin, setIsAdmin] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  useEffect(() => {
    carregarPerfil()
  }, [])

  const carregarPerfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      if (user.email === 'lucianesouzaterapeuta@gmail.com') {
        setIsAdmin(true)
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setUserId(user.id)
        setNome(data.nome || '')
        setDescricao(data.descricao || '')
        setWhatsapp(data.telefone || '')
        setInstagram(data.instagram || '')
        setWebsite(data.website || '')
        setFotoUrl(data.foto_url || '')
        setLinkEntrevista(data.link_entrevista || '')
        
        // Puxa o status de pagamento do banco
        setStatus(data.status || 'ativo')
        
        // Calcula se está perto de vencer (para mostrar o aviso)
        if (data.data_expiracao) {
          const hoje = new Date()
          const vencimento = new Date(data.data_expiracao)
          const diferencaTempo = vencimento.getTime() - hoje.getTime()
          const diferencaDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24))
          setDiasRestantes(diferencaDias)
        }
      }
    } catch (error: any) {
      setMensagem(`Erro ao carregar dados: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setMensagem('')

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione uma imagem.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setFotoUrl(data.publicUrl)
      setMensagem('Nova foto carregada com sucesso! Lembre-se de salvar as alterações.')
    } catch (error: any) {
      setMensagem(`Erro ao subir foto: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleAtualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        nome,
        descricao,
        telefone: whatsapp,
        instagram,
        website,
        foto_url: fotoUrl,
        link_entrevista: linkEntrevista
      })
      .eq('id', user.id)

    if (error) {
      setMensagem(`Erro ao salvar: ${error.message}`)
    } else {
      setMensagem('Alterações salvas com sucesso!')
    }
    setSalvando(false)
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <p className="text-slate-600 animate-pulse text-lg">Carregando os seus dados...</p>
        </div>
      </>
    )
  }

  // Define a regra: Mostra o aviso se estiver suspenso OU se faltar 10 dias ou menos pro vencimento.
  const mostrarAviso = status !== 'ativo' || (diasRestantes !== null && diasRestantes <= 10)
  const estaVencido = status !== 'ativo' || (diasRestantes !== null && diasRestantes < 0)

  return (
    <>
      <SiteHeader />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border-t-4 border-emerald-700 mt-6 mb-10">
          
          {/* BANNER DINÂMICO DE PAGAMENTO / HOTMART */}
          {mostrarAviso && (
            <div className={`mb-8 p-5 rounded-lg border-2 text-center shadow-sm ${estaVencido ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              
              <div className="flex justify-center mb-2">
                <i className={`text-3xl ${estaVencido ? 'fa-solid fa-lock text-red-500' : 'fa-regular fa-clock text-amber-500'}`} aria-hidden="true" />
              </div>
              
              <h3 className={`text-lg font-bold mb-1 ${estaVencido ? 'text-red-800' : 'text-amber-800'}`}>
                {estaVencido 
                  ? 'Seu perfil está suspenso/inativo!' 
                  : `Seu período grátis acaba em ${diasRestantes} dias!`}
              </h3>
              
              <p className="text-sm text-slate-700 mb-5 leading-relaxed">
                {estaVencido
                  ? 'Para voltar a aparecer na plataforma e receber novos clientes, regularize sua assinatura.'
                  : 'Assine agora para garantir que seu perfil continue visível na plataforma sem interrupções.'}
              </p>

              <a 
                href={LINK_CHECKOUT_HOTMART} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-md text-white font-bold transition-colors shadow-md ${estaVencido ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                Assinar via Hotmart
              </a>
            </div>
          )}
          {/* FIM DO BANNER */}


          <h1 className="text-2xl font-bold text-center mb-2 text-slate-800">Editar Meu Perfil</h1>
          <p className="text-center text-slate-600 mb-6 text-sm">Mantenha os seus dados de contato e bio sempre atualizados.</p>

          {mensagem && (
            <div className={`mb-4 p-3 text-center rounded text-sm ${mensagem.includes('Erro') ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleAtualizarPerfil} className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-md bg-slate-50">
              <div className="h-40 w-28 bg-slate-200 mb-3 flex items-center justify-center text-slate-400 rounded-md shadow-sm border border-slate-300 overflow-hidden bg-cover bg-center" style={{ backgroundImage: fotoUrl ? `url(${fotoUrl})` : 'none' }}>
                 {!fotoUrl && 'Sem Foto'}
              </div>
              <div className="relative">
                <button type="button" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                  {uploading ? 'Alterando foto...' : 'Alterar Foto de Perfil'}
                </button>
                <input type="file" accept="image/*" onChange={handleUploadFoto} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Nome Profissional</label>
              <input 
                type="text" 
                required 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Sobre mim (Minha bio)</label>
              <textarea 
                rows={4} 
                required 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">WhatsApp de Contato</label>
              <input 
                type="text" 
                required 
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)} 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Link do Instagram</label>
              <input 
                type="text" 
                value={instagram} 
                onChange={(e) => setInstagram(e.target.value)} 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Link do Site</label>
              <input 
                type="url" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Link da Entrevista (YouTube / Podcast)</label>
              <input 
                type="url" 
                value={linkEntrevista} 
                onChange={(e) => setLinkEntrevista(e.target.value)} 
                placeholder="Ex: https://youtu.be/..." 
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white" 
              />
              <p className="mt-1 text-xs text-slate-500">Deixe em branco caso não tenha uma entrevista gravada.</p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button type="submit" disabled={salvando || uploading} className="w-full bg-emerald-700 text-white p-3 rounded-md hover:bg-emerald-800 disabled:bg-emerald-300 transition-colors font-medium text-lg shadow-sm">
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>

              {userId && (
                <Link
                  href={`/terapeuta/${userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-white border-2 border-emerald-700 text-emerald-700 p-3 rounded-md hover:bg-emerald-50 transition-colors font-medium text-lg shadow-sm"
                >
                  Ver como ficou o meu perfil
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full mt-2 flex items-center justify-center bg-slate-800 text-white p-3 rounded-md hover:bg-slate-900 transition-colors font-medium text-lg shadow-sm"
                >
                  <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true" />
                  Voltar para o Painel Admin
                </Link>
              )}

            </div>
          </form>
        </div>
      </div>
    </>
  )
}