'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase' // <-- Ajustado para o atalho correto do seu projeto
import { SiteHeader } from '@/components/site-header'

export default function EditarPerfilPage() {
  const [userId, setUserId] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [website, setWebsite] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [isAdmin, setIsAdmin] = useState(false) // <-- Verifica se é a proprietária
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

      // Se for o e-mail da proprietária, libera o botão de voltar ao painel admin
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
        foto_url: fotoUrl
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

  return (
    <>
      <SiteHeader />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border-t-4 border-emerald-700 mt-6 mb-10">
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
              <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Sobre mim (Minha bio)</label>
              <textarea rows={4} required value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">WhatsApp de Contato</label>
              <input type="text" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Link do Instagram</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Link do Site</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
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

              {/* ESTE BOTÃO SÓ APARECE PARA A PROPRIETÁRIA */}
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