'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function CompletarPerfilPage() {
  const [descricao, setDescricao] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [website, setWebsite] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  // Função para fazer o upload da foto imediatamente ao escolher o arquivo
  const handleUploadFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setMensagem('')

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Faz o upload para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Pega o link público da foto gerada
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setFotoUrl(data.publicUrl)
      setMensagem('Foto carregada com sucesso! Salve o perfil para finalizar.')
    } catch (error: any) {
      setMensagem(`Erro ao subir foto: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMensagem('Erro: Usuário não encontrado. Faça login novamente.')
      setLoading(false)
      return
    }

    // Salva todos os textos + a URL da foto que acabamos de subir
    const { error } = await supabase
      .from('profiles')
      .update({ 
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
      setMensagem('Perfil salvo com sucesso! Aguarde a aprovação da administração.')
      setTimeout(() => { router.push('/') }, 3000)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border-t-4 border-emerald-700">
        <h1 className="text-2xl font-bold text-center mb-2 text-slate-800">Complete o seu Perfil</h1>
        <p className="text-center text-slate-600 mb-6 text-sm">Estes dados vão ajudar os clientes a conhecerem melhor o seu trabalho.</p>

        {mensagem && (
          <div className={`mb-4 p-3 text-center rounded text-sm ${mensagem.includes('Erro') ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSalvarPerfil} className="space-y-4">
          
          {/* MOLDURA DA FOTO ATUALIZADA */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-md bg-slate-50 relative">
            <div className="h-40 w-28 bg-slate-200 mb-3 flex items-center justify-center text-slate-400 rounded-md shadow-sm border border-slate-300 overflow-hidden bg-cover bg-center" style={{ backgroundImage: fotoUrl ? `url(${fotoUrl})` : 'none' }}>
               {!fotoUrl && (uploading ? 'Carregando...' : 'Sem Foto')}
            </div>
            
            {/* O Input de arquivo fica "escondido" sobre o botão */}
            <div className="relative">
              <button type="button" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors" disabled={uploading}>
                {uploading ? 'A enviar imagem...' : 'Escolher Foto de Perfil'}
              </button>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleUploadFoto}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Formato retrato sugerido</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Sobre si (Sua bio)</label>
            <textarea rows={4} required value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Contato WhatsApp</label>
            <input type="text" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Link do Instagram (Opcional)</label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Link do Site Profissional (Opcional)</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <button type="submit" disabled={loading || uploading} className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors mt-6 font-medium text-lg">
            {loading ? 'A guardar...' : 'Salvar Perfil e Finalizar'}
          </button>
        </form>
      </div>
    </div>
  )
}