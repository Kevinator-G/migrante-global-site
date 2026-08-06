import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Recuperación de acceso admin — crea o resetea una cuenta admin.
// Protegido por ADMIN_BOOTSTRAP_SECRET (variable de entorno, no
// committeada). Úsalo una vez y luego borra esa variable de Vercel:
// dejarla activa es una puerta de entrada permanente si alguien la
// llega a adivinar.
export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_BOOTSTRAP_SECRET no está configurado en el servidor.' },
      { status: 500 }
    );
  }

  const secret = req.headers.get('x-bootstrap-secret');
  if (!secret || secret !== expected) {
    return NextResponse.json({ error: 'Secreto inválido.' }, { status: 401 });
  }

  const { email, newPassword } = await req.json();
  if (!email || !newPassword) {
    return NextResponse.json({ error: 'Falta email o contraseña.' }, { status: 400 });
  }
  if (newPassword.length < 12) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 12 caracteres.' },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: 'admin' },
    create: { email, name: 'Admin', password: hashed, role: 'admin' },
  });

  return NextResponse.json({ success: true, email: user.email });
}
