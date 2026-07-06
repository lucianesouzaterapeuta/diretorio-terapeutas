import Image from 'next/image'
import Link from 'next/link'
import { Globe, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { therapists } from '@/lib/therapists'

type Props = {
  params: Promise<{
    id: string
  }>
}

export function generateStaticParams() {
  return therapists.map((therapist) => ({ id: therapist.id }))
}

export default async function TherapistProfilePage({ params }: Props) {
  const { id } = await params
  const therapist = therapists.find((item) => item.id === id)

  if (!therapist) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground">Terapeuta não encontrado</h1>
        <p className="mt-4 text-muted-foreground">
          O perfil que você tentou acessar não existe ou foi removido.
        </p>
        <Button nativeButton={false} render={<Link href="/" />} className="mt-6">
          Voltar para o início
        </Button>
      </main>
    )
  }

  const whatsappUrl = `https://wa.me/${therapist.whatsapp}?text=${encodeURIComponent(
    `Olá ${therapist.name}, encontrei seu perfil na plataforma Conversas que Curam e gostaria de saber mais sobre seus atendimentos.`,
  )}`
  const instagramUrl = therapist.instagram
    ? `https://www.instagram.com/${therapist.instagram.replace(/^@/, '')}`
    : undefined

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-14 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="relative aspect-[4/5] h-[22rem] w-full overflow-hidden rounded-3xl border border-border bg-muted sm:h-[24rem] lg:w-[26rem]">
            <Image
              src={therapist.image || '/placeholder.svg'}
              alt={`Foto de ${therapist.name}, ${therapist.specialty}`}
              fill
              sizes="(max-width: 1024px) 100vw, 26rem"
              className="object-cover object-top"
            />
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                Perfil exclusivo
              </span>
              <h1 className="text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
                {therapist.name}
              </h1>
              <p className="text-lg font-medium text-muted-foreground">{therapist.specialty}</p>
            </div>

            <p className="text-base leading-relaxed text-foreground/90">{therapist.bio}</p>

            <div className="flex flex-wrap gap-3">
              {therapist.instagram && instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                >
                  <AtSign className="size-4" aria-hidden="true" />
                  {therapist.instagram}
                </a>
              )}
              {therapist.website && (
                <a
                  href={therapist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  <Globe className="size-4" aria-hidden="true" />
                  Visitar site
                </a>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
                aria-label="Entrar em contato por WhatsApp"
              >
                <i className="fab fa-whatsapp text-current text-lg" aria-hidden="true" />
                Contato via WhatsApp
              </Button>
              <Button nativeButton={false} render={<Link href="/" />} className="w-full sm:w-auto">
                Voltar ao diretório
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
