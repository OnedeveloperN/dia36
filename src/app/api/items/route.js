import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/models/Item';

export async function GET() {
    try {
        await connectDB();
        const items = await Item.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Error al obtener los elementos de la base de datos' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // Validación básica de entrada
        if (!body.title || body.title.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'El campo título es obligatorio' },
                { status: 400 }
            );
        }

        const newItem = await Item.create({
            title: body.title,
            description: body.description || '',
        });

        return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Error al crear el elemento' },
            { status: 500 }
        );
    }
}