import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const lang = searchParams.get('lang') || 'en';

    if (!id) {
        return NextResponse.json({ error: 'Missing movie id' }, { status: 400 });
    }

    try {
        const details = await getMovieDetails(Number(id), lang);
        return NextResponse.json(details);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
