import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; 

// Impede a Vercel de fazer cache, forçando a leitura ao vivo toda vez
export const dynamic = 'force-dynamic';

export async function GET() {
  // ATENÇÃO: Substitua 'terapeutas' pelo nome da sua tabela principal no Supabase
  // Pode ser 'terapeutas', 'profiles', 'usuarios', etc.
  const { error } = await supabase.from('profiles').select('id').limit(1);
  
  if (error) {
    return NextResponse.json({ status: 'Erro ao conectar', error }, { status: 500 });
  }
  
  return NextResponse.json({ status: 'Supabase do Diretório acordado! ⏰' });
}