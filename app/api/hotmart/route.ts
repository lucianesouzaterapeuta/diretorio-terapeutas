import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Verifica o evento e o e-mail do comprador enviado pela Hotmart
    const evento = body.event
    const email = body.data?.buyer?.email || body.email

    if (evento === 'PURCHASE_APPROVED' && email) {
      // Localiza o terapeuta pelo e-mail na base de dados
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (profile) {
        // Se já tiver uma data de expiração futura válida, soma 1 mês a partir dela. Se não, soma a partir de hoje.
        const baseDate = profile.data_expiracao && new Date(profile.data_expiracao) > new Date() 
          ? new Date(profile.data_expiracao) 
          : new Date()

        baseDate.setMonth(baseDate.getMonth() + 1)

        // Atualiza o status para ativo e estende o vencimento por 1 mês
        await supabase
          .from('profiles')
          .update({
            status: 'ativo',
            data_expiracao: baseDate.toISOString()
          })
          .eq('id', profile.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro no Webhook da Hotmart:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}