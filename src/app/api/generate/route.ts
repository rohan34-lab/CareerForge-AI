import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePlan } from '@/lib/generator';

const profileSchema = z.object({
  name: z.string().trim().max(80),
  targetRole: z.string().trim().min(2).max(80),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  interests: z.string().trim().max(300),
  weeklyHours: z.number().int().min(1).max(40),
  strengths: z.string().trim().max(300),
  weakAreas: z.string().trim().max(300),
  tools: z.string().trim().max(300)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid profile payload',
          issues: validation.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const plan = await generatePlan(validation.data);
    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
