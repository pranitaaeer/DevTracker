import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, notes, durationMin, projectId } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        title,
        notes: notes ?? null,
        durationMin: Number(durationMin) ?? 0,
        projectId: projectId ?? null
      }
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
