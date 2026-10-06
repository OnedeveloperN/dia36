import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/models/Item';

// GET /api/items
export async function GET() {
    try {
        await connectDB();
        const items = await Item.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error en GET /api/items:', error);
        return NextResponse.json({ error: 'Error al obtener ítems' }, { status: 500 });
    }
}

// POST /api/items
export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.title || body.title.trim() === '') {
            return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 });
        }

        await connectDB();
        const newItem = await Item.create({
            title: body.title,
            description: body.description || '',
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error en POST /api/items:', error);
        return NextResponse.json({ error: 'Error al crear ítem' }, { status: 500 });
    }
}