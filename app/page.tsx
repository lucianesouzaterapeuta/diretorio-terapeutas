import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { TherapistsSection } from '@/components/therapists-section'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TherapistsSection />

        <section className="bg-secondary/50 py-16 md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center md:px-6">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-balance font-serif text-2xl font-bold text-foreground md:text-3xl">
              Transparência e responsabilidade
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              A Conversas que Curam atua exclusivamente como plataforma
              intermediadora entre clientes e terapeutas independentes. Não
              prestamos serviços terapêuticos e não substituímos atendimento
              médico, psicológico ou psiquiátrico. Conheça nossos termos antes de
              contratar.
            </p>
            <Button variant="outline" nativeButton={false} render={<Link href="/termos" />}>
              Ler Termos de Uso e Isenção de Responsabilidade
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
