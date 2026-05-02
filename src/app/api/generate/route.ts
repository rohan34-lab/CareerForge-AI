import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/generator';
import { ProfileInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const profile = (await request.json()) as ProfileInput;
    const plan = await generatePlan(profile);
    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
