// Serverless Route Handler — activities + submissions.
import { NextRequest, NextResponse } from 'next/server';
import { SEED_ACTIVITIES, SEED_SUBMISSIONS } from '@/lib/seed';
import type { TeachlyActivity, ActivitySubmission } from '@ecosystem/types';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const studentId = searchParams.get('studentId');
  const includeSubmissions = searchParams.get('includeSubmissions') === 'true';

  if (!classId) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'classId query param is required' } },
      { status: 400 },
    );
  }

  const activities = SEED_ACTIVITIES.filter((a) => a.classId === classId);

  if (!includeSubmissions) {
    return NextResponse.json({ data: activities, total: activities.length });
  }

  const activityIds = new Set(activities.map((a) => a.id));
  let submissions: ActivitySubmission[] = SEED_SUBMISSIONS.filter((s) => activityIds.has(s.activityId));

  if (studentId) {
    submissions = submissions.filter((s) => s.studentId === studentId);
  }

  return NextResponse.json({ data: activities, submissions, total: activities.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Partial<TeachlyActivity>;

  if (!body.classId || !body.title || !body.type) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'classId, title, and type are required' } },
      { status: 422 },
    );
  }

  const newActivity: TeachlyActivity = {
    id: `act-${Date.now()}`,
    classId: body.classId,
    title: body.title,
    description: body.description ?? '',
    type: body.type,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    createdAt: new Date(),
  };

  return NextResponse.json({ data: newActivity }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as Partial<ActivitySubmission> & { activityId: string; studentId: string };

  if (!body.activityId || !body.studentId) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'activityId and studentId are required' } },
      { status: 422 },
    );
  }

  const submission: ActivitySubmission = {
    id: `sub-${Date.now()}`,
    activityId: body.activityId,
    studentId: body.studentId,
    status: 'submitted',
    submittedAt: new Date(),
    content: body.content,
  };

  return NextResponse.json({ data: submission });
}
