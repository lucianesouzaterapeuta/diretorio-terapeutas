import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

// SEU LINK DE PAGAMENTO DA HOTMART OFICIAL
const LINK_CHECKOUT_HOTMART = "https://pay.hotmart.com/K107726651A"

// Configuração do Nodemailer com o Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lucianesouzaterapeuta@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'SUA_SENHA_DE_APLICATIVO_DO_GMAIL' // Lembre-se de configurar a senha de app do Gmail
  }
})

// GET: Disparado automaticamente pelo Cron diário da Vercel (avisa quem vence em 3 dias)
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hoje = new Date()
    const daqui3Dias = new Date()
    daqui3Dias.setDate(hoje.getDate() + 3)
    const dataAlvoStr = daqui3Dias.toISOString().split('T')[0]

    const { data: terapeutas, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'ativo')
      .gte('data_expiracao', `${dataAlvoStr}T00:00:00`)
      .lte('data_expiracao', `${dataAlvoStr}T23:59:59`)

    if (error) throw error

    if (!terapeutas || terapeutas.length === 0) {
      return NextResponse.json({ success: true, message: 'Nenhum e-mail de aviso necessário hoje.' })
    }

    let emailsEnviados = 0

    for (const t of terapeutas) {
      if (!t.email) continue

      const mailOptions = {
        from: '"Conversas que Curam" <lucianesouzaterapeuta@gmail.com>',
        to: t.email,
        subject: 'Sua assinatura na plataforma Conversas que Curam vence em breve',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #006d5b;">Olá, ${t.nome || 'Terapeuta'}!</h2>
            <p>O seu período de acesso na plataforma <strong>Conversas que Curam</strong> está próximo do vencimento (daqui a 3 dias).</p>
            <p>Para garantir que o seu perfil continue ativo no diretório e você não perca novos clientes, realize a sua assinatura mensal pelo link abaixo:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${LINK_CHECKOUT_HOTMART}" target="_blank" style="background-color: #006d5b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Garantir Minha Assinatura via Hotmart</a>
            </div>
            <p>Se você já realizou o pagamento recentemente, por favor desconsidere este e-mail.</p>
            <p style="margin-top: 40px; font-size: 12px; color: #888;">Atenciosamente,<br>Equipe Conversas que Curam</p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)
      emailsEnviados++
    }

    return NextResponse.json({ success: true, enviados: emailsEnviados })
  } catch (error: any) {
    console.error('Erro no cron de lembretes:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST: Disparado manualmente pelo botão "Enviar Lembrete" no Painel Admin
export async function POST(request: Request) {
  try {
    const { therapistId } = await request.json()
    if (!therapistId) {
      return NextResponse.json({ error: 'ID do terapeuta não fornecido' }, { status: 400 })
    }

    const { data: t, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', therapistId)
      .single()

    if (error || !t || !t.email) {
      return NextResponse.json({ error: 'Terapeuta não encontrado ou sem e-mail' }, { status: 404 })
    }

    const mailOptions = {
      from: '"Conversas que Curam" <lucianesouzaterapeuta@gmail.com>',
      to: t.email,
      subject: 'Renovação da sua assinatura - Conversas que Curam',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #006d5b;">Olá, ${t.nome || 'Terapeuta'}!</h2>
          <p>Este é um lembrete enviado pela administração da plataforma <strong>Conversas que Curam</strong> sobre a sua assinatura.</p>
          <p>Para garantir que o seu perfil continue ativo no diretório e você não perca novos clientes, realize a sua assinatura mensal pelo link abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${LINK_CHECKOUT_HOTMART}" target="_blank" style="background-color: #006d5b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Garantir Minha Assinatura via Hotmart</a>
          </div>
          <p>Se você já realizou o pagamento recentemente, por favor desconsidere este e-mail.</p>
          <p style="margin-top: 40px; font-size: 12px; color: #888;">Atenciosamente,<br>Equipe Conversas que Curam</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: 'E-mail enviado com sucesso!' })
  } catch (error: any) {
    console.error('Erro ao enviar e-mail manual:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}