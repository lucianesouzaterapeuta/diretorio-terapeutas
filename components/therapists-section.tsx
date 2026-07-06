import { TherapistCard } from '@/components/therapist-card'
import { therapists } from '@/lib/therapists'

export function TherapistsSection() {
  return (
    <section id="terapeutas" className="scroll-mt-24 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Terapeutas em destaque
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Profissionais dedicados ao seu bem-estar
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Conheça alguns dos terapeutas independentes cadastrados na plataforma e
            escolha aquele que mais combina com o seu momento.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      </div>
    </section>
  )
}
