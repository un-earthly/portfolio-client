import { NextResponse } from 'next/server';
import { getAllBlogs } from '@/lib/blogs';

export const runtime = 'nodejs';

// GET /api/blogs → lightweight card data for every post (newest first).
export async function GET() {
    const blogs = getAllBlogs().map(({ slug, title, excerpt, readTime, type, tags, cover, date }) => ({
        slug, title, excerpt, readTime, type, tags, cover, date,
    }));
    return NextResponse.json({ blogs }, { status: 200 });
}
