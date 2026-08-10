import { NextRequest, NextResponse } from 'next/server';
import { registerStudent, cancelRegistration, updateRegistrationStatus, getStudentRegistrations, getNgoCampaignsWithApplicants } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const student_id = searchParams.get('student_id');
    const ngo_id = searchParams.get('ngo_id');

    if (student_id) {
      const registrations = await getStudentRegistrations(student_id);
      return NextResponse.json({ success: true, registrations });
    }

    if (ngo_id) {
      const campaignApplicants = await getNgoCampaignsWithApplicants(ngo_id);
      return NextResponse.json({ success: true, campaignApplicants });
    }

    return NextResponse.json({ success: false, error: 'student_id or ngo_id parameter required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, campaign_id, action } = body;

    if (!student_id || !campaign_id) {
      return NextResponse.json({ success: false, error: 'student_id and campaign_id are required' }, { status: 400 });
    }

    if (action === 'cancel') {
      const success = await cancelRegistration(student_id, campaign_id);
      return NextResponse.json({ success, message: 'Registration cancelled' });
    } else {
      const registration = await registerStudent(student_id, campaign_id);
      return NextResponse.json({ success: true, registration });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { registration_id, status } = body;

    if (!registration_id || !status) {
      return NextResponse.json({ success: false, error: 'registration_id and status are required' }, { status: 400 });
    }

    const updated = await updateRegistrationStatus(registration_id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
