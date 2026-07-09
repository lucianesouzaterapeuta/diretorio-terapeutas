'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TherapistCard({ therapist }: { therapist: any }) {
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
    <article className="flex flex-col h-full overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
            <Button nativeButton={false} render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />} className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white">
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
    </article>
  )
}