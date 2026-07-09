'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()

  // Oculta o cabeçalho se o usuário já estiver nas telas de cadastro ou login
  if (pathname === '/login' || pathname === '/cadastro' || pathname === '/completar-perfil') {
    return null
  }

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Nome do Site */}
        <Link href="/" className="text-xl font-bold text-emerald-700 tracking-tight">
          Diretório<span className="text-slate-800">Terapeutas</span>
        </Link>

        {/* Menu de Navegação e Botões */}
        <nav className="flex items-center space-x-4 sm:space-x-6">
          
          {/* Links de navegação simples */}
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors hidden sm:block">
            Início
          </Link>
          <Link href="/sobre" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors hidden sm:block">
            Sobre
          </Link>
          
          {/* Divisória e Botões de Acesso */}
          <div className="flex items-center space-x-4 border-l border-slate-200 pl-4 sm:pl-6 ml-2">
            
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Entrar
            </Link>
            
            <Link 
              href="/cadastro" 
              className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Cadastre-se
            </Link>
            
          </div>
        </nav>

      </div>
    </header>
  )
}