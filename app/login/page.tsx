'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    // Tenta fazer o login no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setMensagem('Erro ao entrar: E-mail ou senha incorretos.')
      setLoading(false)
    } else {
      // A MÁGICA DA TRIAGEM ACONTECE AQUI:
      if (data.user?.email === 'lucianesouzaterapeuta@gmail.com') {
        // Se for a conta da proprietária, vai para o painel Admin
        router.push('/admin')
      } else {
        // Se for um terapeuta normal, vai para a edição de perfil
        router.push('/editar-perfil')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border-t-4 border-emerald-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Acesso à Plataforma</h1>
        
        {mensagem && (
          <div className="mb-4 p-3 text-center rounded bg-red-100 text-red-800 text-sm">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-700 text-white p-2 rounded-md hover:bg-emerald-800 disabled:bg-emerald-300 transition-colors font-medium text-lg mt-4"
          >
            {loading ? 'A entrar...' : 'Entrar na Conta'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem conta? <Link href="/cadastro" className="text-emerald-700 hover:underline">Cadastre-se aqui</Link>
        </div>
      </div>
    </div>
  )
}