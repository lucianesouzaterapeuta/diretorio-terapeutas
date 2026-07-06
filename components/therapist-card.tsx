import Image from 'next/image'
import Link from 'next/link'
import { Globe, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Therapist } from '@/lib/therapists'

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  const profileHref = `/terapeuta/${therapist.id}`
  const whatsappUrl = `https://wa.me/${therapist.whatsapp}?text=${encodeURIComponent(
    `Olá ${therapist.name}, encontrei seu perfil na plataforma Conversas que Curam e gostaria de saber mais sobre seus atendimentos.`,
  )}`
  const instagramUrl = therapist.instagram
    ? `https://www.instagram.com/${therapist.instagram.replace(/^@/, '')}`
    : undefined

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={therapist.image || '/placeholder.svg'}
          alt={`Foto de ${therapist.name}, ${therapist.specialty}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 hover:scale-105"
        />
        {therapist.founder && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            Fundadora
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-xl font-bold text-foreground">{therapist.name}</h3>
          <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            {therapist.specialty}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {therapist.bio}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          {(therapist.instagram || therapist.website) && (
            <div className="flex flex-wrap items-center gap-3">
              {therapist.instagram && instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <AtSign className="size-3.5" aria-hidden="true" />
                  {therapist.instagram}
                </a>
              )}
              {therapist.website && (
                <a
                  href={therapist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Globe className="size-3.5" aria-hidden="true" />
                  Ver site
                </a>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link href={`/terapeuta/${therapist.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver perfil
              </Button>
            </Link>
            <Button
              nativeButton={false}
              render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
              className="shrink-0 bg-primary hover:bg-primary/90"
            >
              <i className="fab fa-whatsapp text-current text-lg" aria-hidden="true" />
              Contato via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
