import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/api';

export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get('ids') ?? '').split(',').filter(Boolean).slice(0, 24);
  return NextResponse.json(await getProductsByIds(ids));
}
