import { NextResponse } from 'next/server';
import { isCooling } from '@/lib/thermal-monitor';

export async function GET() {
  return NextResponse.json({
    cooling: isCooling(),
    threshold_c: 80,
    penalty_c: 85,
  });
}