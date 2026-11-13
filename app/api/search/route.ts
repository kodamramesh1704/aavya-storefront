import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/api';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') ?? '';
  return NextResponse.json(await searchProducts(q, 6));
}
