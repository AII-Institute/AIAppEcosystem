// Serverless Route Handler — community posts per class.
import { NextRequest, NextResponse } from 'next/server';
import { SEED_COMMUNITY } from '@/lib/seed';
import type { CommunityPost } from '@ecosystem/types';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  if (!classId) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'classId query param is required' } },
      { status: 400 },
    );
  }

  const posts = SEED_COMMUNITY.filter((p) => p.classId === classId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);

  return NextResponse.json({ data: posts, total: posts.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    classId: string;
    authorId: string;
    authorName: string;
    authorRole: CommunityPost['authorRole'];
    content: string;
  };

  if (!body.classId || !body.authorId || !body.content) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: 'classId, authorId, and content are required' } },
      { status: 422 },
    );
  }

  const newPost: CommunityPost = {
    id: `post-${Date.now()}`,
    classId: body.classId,
    authorId: body.authorId,
    authorName: body.authorName ?? 'Anonymous',
    authorRole: body.authorRole ?? 'parent',
    content: body.content,
    reactions: [],
    createdAt: new Date(),
  };

  return NextResponse.json({ data: newPost }, { status: 201 });
}
