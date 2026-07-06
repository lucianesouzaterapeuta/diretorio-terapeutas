import Image from 'next/image'
import type { Metadata } from 'next'
import { MessageCircle, AtSign, Globe } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { founders } from '@/lib/therapists'

export const metadata: Metadata = {
  title: 'Sobre | Conversas que Curam',
  description:
    'Conheça as fundadoras da plataforma Conversas que Curam, suas guias nesta jornada de cura e transformação.',
}

export default function SobrePage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-28 md:pt-32">
        <section className="mx-auto max-w-4xl px-4 pb-12 text-center md:px-6">
          <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Sobre a plataforma
          </span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
            Suas Guias nesta Jornada
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            A Conversas que Curam nasceu do propósito de acolher, inspirar e
            conectar pessoas a terapeutas dedicados. Conheça quem está à frente
            desta missão.
          </p>
        </section>

        <section className="mx-auto flex max-w-5xl flex-col gap-12 px-4 pb-20 md:px-6">
          {founders.map((founder, index) => {
            const whatsappUrl = `https://wa.me/${founder.whatsapp}`
            return (
              <article
                key={founder.id}
                className={`grid items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm md:grid-cols-5 md:p-8 ${
                  index % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
                }`}
              >
                <div className="md:col-span-2">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-border shadow-md">
                    <Image
                      src={founder.image || '/placeholder.svg'}
                      alt={`Foto de ${founder.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:col-span-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                      {founder.name}
                    </h2>
                    <p className="mt-1 font-medium text-primary">Fundadora · {founder.specialty}</p>
                  </div>

                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {founder.bio}
                  </p>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {founder.instagram && (
                      <span className="inline-flex items-center gap-2">
                        <AtSign className="size-4 text-primary" aria-hidden="true" />
                        {founder.instagram}
                      </span>
                    )}
                    {founder.website && (
                      <a
                        href={founder.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                      >
                        <Globe className="size-4" aria-hidden="true" />
                        Visitar site
                      </a>
                    )}
                  </div>

                  <Button
                    nativeButton={false}
                    render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
                    className="w-full sm:w-fit"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </article>
            )
          })}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
