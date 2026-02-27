import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/tmdb';
import { RecommendationRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const body: RecommendationRequest = await request.json();
        const results = await getRecommendations(body);

        return NextResponse.json({ results: results.slice(0, 20) });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
