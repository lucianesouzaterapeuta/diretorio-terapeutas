'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (authError) {
      setMensagem(`Erro: ${authError.message}`)
      setLoading(false)
      return
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, nome, email, telefone }])

      if (profileError) {
        setMensagem('Conta criada, mas houve um erro de segurança ao salvar o perfil.')
        setLoading(false)
      } else {
        // A mágica do redirecionamento
        router.push('/completar-perfil')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border-t-4 border-emerald-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Cadastro de Terapeuta</h1>
        {mensagem && (
          <div className="mb-4 p-3 text-center rounded bg-red-100 text-red-800 text-sm">
            {mensagem}
          </div>
        )}
        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">WhatsApp / Telefone</label>
            <input type="text" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-700 text-white p-2 rounded-md hover:bg-emerald-800 disabled:bg-emerald-300 transition-colors font-medium text-lg">
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  )
}