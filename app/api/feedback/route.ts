import { NextResponse } from 'next/server';
import { fetchFeedbackEntries } from '@/app/actions/formActions';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetchFeedbackEntries();
    return NextResponse.json(res, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message ?? 'Failed to load feedback.' }, { status: 500 });
  }
}
