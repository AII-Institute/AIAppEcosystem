// Serverless Route Handler — student roster + progress.
import { NextRequest, NextResponse } from 'next/server';
import { SEED_STUDENTS, SEED_SUBMISSIONS, SEED_ACTIVITIES } from '@/lib/seed';
import type { TeachlyParentProgress } from '@ecosystem/types';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const classId = searchParams.get('classId');
  const includeProgress = searchParams.get('includeProgress') === 'true';

  if (studentId) {
    const student = SEED_STUDENTS.find((s) => s.id === studentId);
    if (!student) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: `Student ${studentId} not found` } },
        { status: 404 },
      );
    }

    if (includeProgress) {
      const classActivities = SEED_ACTIVITIES.filter((a) => student.classIds.includes(a.classId));
      const studentSubs = SEED_SUBMISSIONS.filter((s) => s.studentId === studentId);
      const doneIds = new Set(studentSubs.filter((s) => s.status === 'submitted' || s.status === 'reviewed').map((s) => s.activityId));

      const progress: TeachlyParentProgress = {
        childId: student.id,
        attendancePercent: 87,
        sessionsAttended: 13,
        totalSessions: 15,
        activitiesDone: doneIds.size,
        activitiesPending: classActivities.length - doneIds.size,
        starsEarned: student.stars,
        badgesEarned: student.badges.length,
      };

      return NextResponse.json({ data: { student, progress } });
    }

    return NextResponse.json({ data: student });
  }

  let students = SEED_STUDENTS;
  if (classId) {
    students = students.filter((s) => s.classIds.includes(classId));
  }

  return NextResponse.json({ data: students, total: students.length });
}
