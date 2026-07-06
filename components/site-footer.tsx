import Link from 'next/link'
import { Leaf } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Leaf className="size-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-lg font-bold text-foreground">
                Conversas que Curam
              </span>
            </div>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Uma plataforma que conecta pessoas a terapeutas independentes de
              confiança. Cuidamos do encontro; o cuidado com você é feito com
              acolhimento e dedicação.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-foreground">Navegação</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#terapeutas" className="text-muted-foreground hover:text-primary">
                  Terapeutas
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-primary">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-foreground">Conta</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li>
                <Link href="/entrar" className="text-muted-foreground hover:text-primary">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="text-muted-foreground hover:text-primary">
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} Conversas que Curam. Todos os direitos
            reservados.
          </p>
          <p className="text-center md:text-right">
            Plataforma intermediadora — não prestamos serviços clínicos.
          </p>
        </div>
      </div>
    </footer>
  )
}
