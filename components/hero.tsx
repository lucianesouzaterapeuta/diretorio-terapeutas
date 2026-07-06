'use client'

import Image from 'next/image'
import { Search, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 md:grid-cols-2 md:px-6 md:pb-24">
        <div className="flex flex-col gap-6 text-center md:text-left">
          <span className="mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground md:mx-0">
            <Heart className="size-4" aria-hidden="true" />
            Cuidando da sua saúde emocional
          </span>

          <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Encontre o terapeuta certo para a sua jornada de cura
          </h1>

          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Conectamos você a terapeutas independentes de confiança. Um espaço de
            acolhimento, calma e transformação para cuidar da sua mente e do seu
            coração.
          </p>

          <form
            className="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row md:mx-0"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="busca" className="sr-only">
              Buscar por nome ou especialidade
            </label>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-background px-3">
              <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                id="busca"
                type="text"
                placeholder="Nome ou especialidade (ex: EFT, TRG)"
                className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Buscar
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">
            Mais de <span className="font-semibold text-foreground">120 terapeutas</span>{' '}
            prontos para acolher você.
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-lg">
            <Image
              src="/hero-ambiente.png"
              alt="Ambiente terapêutico acolhedor com poltrona confortável e luz natural suave"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-md sm:block">
            <p className="font-serif text-2xl font-bold text-primary">+8 anos</p>
            <p className="text-sm text-muted-foreground">acolhendo pessoas</p>
          </div>
        </div>
      </div>
    </section>
  )
}
