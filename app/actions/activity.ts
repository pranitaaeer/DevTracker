import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function createActivityAction(data: { title: string; notes?: string; durationMin?: number; projectId?: string }) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const activity = await prisma.activity.create({
    data: {
      userId: user.id,
      title: data.title,
      notes: data.notes ?? null,
      durationMin: data.durationMin ?? 0,
      projectId: data.projectId ?? null
    }
  });

  return activity;
}
