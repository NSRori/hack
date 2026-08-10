import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, createCampaign } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const cause = searchParams.get('cause') || undefined;
    const location = searchParams.get('location') || undefined;
    const date = searchParams.get('date') || undefined;
    const duration = searchParams.get('duration') || undefined;
    const student_id = searchParams.get('student_id') || undefined;

    const campaigns = await getCampaigns({ search, cause, location, date, duration, student_id });
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ngo_id, ngo_name, title, description, cause_category, location, date, duration_hours, required_volunteers, image_url, requirements } = body;

    if (!ngo_id || !title || !description || !cause_category || !location || !date || !required_volunteers) {
      return NextResponse.json({ success: false, error: 'Missing required campaign fields' }, { status: 400 });
    }

    const id = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCampaign = await createCampaign({
      id,
      ngo_id,
      ngo_name: ngo_name || 'NGO Partner',
      title,
      description,
      cause_category,
      location,
      date,
      duration_hours: Number(duration_hours) || 4,
      required_volunteers: Number(required_volunteers) || 10,
      image_url: image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      requirements: requirements ? (typeof requirements === 'string' ? requirements : JSON.stringify(requirements)) : null,
    });

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
