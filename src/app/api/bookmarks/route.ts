import { NextRequest, NextResponse } from 'next/server';
import { toggleBookmark, getStudentBookmarks } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const student_id = searchParams.get('student_id');

    if (!student_id) {
      return NextResponse.json({ success: false, error: 'student_id parameter required' }, { status: 400 });
    }

    const bookmarks = await getStudentBookmarks(student_id);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, campaign_id } = body;

    if (!student_id || !campaign_id) {
      return NextResponse.json({ success: false, error: 'student_id and campaign_id are required' }, { status: 400 });
    }

    const isBookmarked = await toggleBookmark(student_id, campaign_id);
    return NextResponse.json({ success: true, is_bookmarked: isBookmarked });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
