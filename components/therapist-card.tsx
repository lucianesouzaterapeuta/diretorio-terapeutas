'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TherapistCard({ therapist }: { therapist: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const id = therapist?.id;
  const nome = therapist?.nome || therapist?.name || 'Terapeuta'
  const telefone = therapist?.telefone || therapist?.whatsapp || ''
  const foto = therapist?.foto_url || therapist?.foto_perfil || therapist?.foto || therapist?.image || '/placeholder.svg'
  const especialidade = therapist?.especialidade || therapist?.specialty || 'Atendimento Terapêutico'
  const descricao = therapist?.descricao || therapist?.sobre || therapist?.bio || 'Sem descrição.'
  const fundadora = therapist?.fundadora || therapist?.founder || false
  
  const numeroLimpo = telefone.replace(/\D/g, '')
  const whatsappUrl = numeroLimpo 
    ? `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(`Olá ${nome}, encontrei seu perfil na plataforma Conversas que Curam e gostaria de saber mais sobre seus atendimentos.`)}`
    : '#'

  return (
    <article className="flex flex-col h-full overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-emerald-50">
        <Image 
          src={foto} 
          alt={`Foto de ${nome}`} 
          fill 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
          className="object-cover object-top transition-transform duration-700 hover:scale-110" 
        />
        {fundadora && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            Fundadora
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-emerald-900 line-clamp-1" title={nome}>
          {nome}
        </h3>
        <span className="mt-1 w-fit rounded-full bg-emerald-50 px-2 py-1 text-[10px] sm:text-xs font-semibold text-emerald-700 line-clamp-1">
          {especialidade}
        </span>

        <p className="mt-3 line-clamp-3 text-xs sm:text-sm leading-relaxed text-stone-600">
          {descricao}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Link href={`/terapeuta/${id}`} className="w-full">
            <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Ver perfil
            </Button>
          </Link>
          
          {numeroLimpo ? (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <i className="fab fa-whatsapp text-base mr-2" aria-hidden="true" />
              WhatsApp
            </Button>
          ) : (
            <Button disabled className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-stone-200 cursor-not-allowed">
              Sem WhatsApp
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Termos de Uso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            
            {/* Botão de fechar (X) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h3 className="text-xl font-serif font-bold mb-4 text-emerald-900">Aviso Importante</h3>
            
            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
              A <strong>Conversas que Curam</strong> atua exclusivamente como plataforma intermediadora entre clientes e terapeutas independentes. Não prestamos serviços terapêuticos e não substituímos atendimento médico ou psiquiátrico. Conheça nossos <a href="/termos" target="_blank" className="text-emerald-600 font-semibold underline hover:text-emerald-800">termos</a> antes de contratar.
            </p>

            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 cursor-pointer accent-emerald-600 rounded border-stone-300"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">
                Estou ciente e concordo com as condições descritas acima.
              </span>
            </label>

            <a 
              href={agreed ? whatsappUrl : "#"} 
              target={agreed ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!agreed) {
                  e.preventDefault();
                } else {
                  setIsModalOpen(false); // Fecha o modal após ir para o zap
                }
              }}
              className={`flex items-center justify-center w-full py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                agreed 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg" 
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <i className="fab fa-whatsapp text-lg mr-2" aria-hidden="true" />
              Continuar para o WhatsApp
            </a>
          </div>
        </div>
      )}
    </article>
  )
}