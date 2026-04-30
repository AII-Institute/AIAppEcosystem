// Serverless Route Handler — deployed as an isolated function per request.
// No persistent state; reads from in-memory seed data (swap for DB in prod).
import { NextRequest, NextResponse } from 'next/server';
import { SEED_CLASSES } from '@/lib/seed';
import type { TeachlyClass } from '@ecosystem/types';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get('teacherId');
  const studentId = searchParams.get('studentId');

  let classes: TeachlyClass[] = SEED_CLASSES;

  if (teacherId) {
    classes = classes.filter((c) => c.teacherId === teacherId);
  }
  if (studentId) {
    classes = classes.filter((c) => c.studentIds.includes(studentId));
  }

  return NextResponse.json({ data: classes, total: classes.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Partial<TeachlyClass>;

  if (!body.name || !body.emoji || !body.teacherId || !body.schedule || !body.color) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'name, emoji, teacherId, schedule, and color are required' } },
      { status: 422 },
    );
  }

  const newClass: TeachlyClass = {
    id: `cls-${Date.now()}`,
    name: body.name,
    emoji: body.emoji,
    teacherId: body.teacherId,
    schedule: body.schedule,
    color: body.color,
    studentIds: body.studentIds ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production this would persist to PostgreSQL via RLS-protected write.
  return NextResponse.json({ data: newClass }, { status: 201 });
}
