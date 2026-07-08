import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  AtSign,
  CalendarDays,
  Compass,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { therapists } from '@/lib/therapists'

const specialties = [
  {
    title: 'Atendimento individual',
    description: 'Acolhimento terapêutico pensado para cada etapa da sua jornada.',
  },
  {
    title: 'Escuta emocional',
    description: 'Espaço seguro para identificar bloqueios e reorganizar sua percepção.',
  },
  {
    title: 'Cura da criança interior',
    description: 'Trabalho com memórias, dores antigas e processos de autorreparação.',
  },
  {
    title: 'Integração e crescimento',
    description: 'Orientação para reconectar-se com clareza, presença e bem-estar.',
  },
]

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
    <main className="min-h-screen bg-stone-50/70">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-stone-200 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
          <div className="w-full lg:w-[32rem] lg:flex-shrink-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 shadow-inner">
              <Image
                src={therapist.image || '/placeholder.svg'}
                alt={`Foto de ${therapist.name}, ${therapist.specialty}`}
                fill
                sizes="(max-width: 1024px) 100vw, 32rem"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-900/10 px-3 py-1 text-sm font-semibold text-blue-900">
              <Sparkles className="size-4" aria-hidden="true" />
              Perfil exclusivo
            </span>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-blue-950 sm:text-5xl">
              {therapist.name}
            </h1>
            <p className="mt-3 text-lg font-semibold text-blue-800">{therapist.specialty}</p>
            <p className="mt-5 max-w-2xl font-sans text-base leading-8 text-stone-700 sm:text-lg">
              {therapist.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {therapist.instagram && instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
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
                  className="inline-flex items-center gap-2 rounded-full bg-blue-900/10 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-900/20"
                >
                  <Globe className="size-4" aria-hidden="true" />
                  Visitar site
                </a>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  />
                }
                className="w-full justify-center rounded-full bg-blue-900 px-6 py-6 text-base font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:bg-blue-800 sm:w-auto"
                aria-label="Agendar consulta por WhatsApp"
              >
                <CalendarDays className="size-5" aria-hidden="true" />
                Agendar Consulta
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/" />}
                className="w-full rounded-full border border-stone-300 bg-white px-6 py-6 text-base font-semibold text-stone-700 transition hover:border-blue-900 hover:text-blue-900 sm:w-auto"
              >
                Voltar ao diretório
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Compass className="size-5 text-blue-900" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-semibold text-blue-950">
                Áreas de Atuação
              </h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {specialties.map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <h3 className="font-semibold text-blue-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-stone-200 bg-blue-900/95 p-6 text-white sm:p-8">
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-5" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-semibold">Sobre o Atendimento</h2>
            </div>

            <p className="mt-4 font-sans text-base leading-8 text-blue-50/90">
              Cada encontro é construído com presença, respeito e profundidade, oferecendo um espaço
              acolhedor para cuidar de emoções, padrões antigos e necessidades atuais.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex gap-3 rounded-2xl bg-white/10 p-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Escuta acolhedora</p>
                  <p className="mt-1 text-sm text-blue-50/80">
                    Um ambiente seguro para falar com liberdade e sensibilidade.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 rounded-2xl bg-white/10 p-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Abordagem sensível</p>
                  <p className="mt-1 text-sm text-blue-50/80">
                    Estratégias adaptadas ao seu processo e ao seu ritmo.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 rounded-2xl bg-white/10 p-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Cuidado humano</p>
                  <p className="mt-1 text-sm text-blue-50/80">
                    Atendimento com presença, ética e acolhimento profissional.
                  </p>
                </div>
              </li>
            </ul>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-blue-200"
            >
              Conversar pelo WhatsApp
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </section>
        </div>
      </section>
    </main>
  )
}
