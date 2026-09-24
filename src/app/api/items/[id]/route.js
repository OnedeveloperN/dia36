import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Item from '@/models/Item';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        if (!body.title || body.title.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'El título no puede estar vacío' },
                { status: 400 }
            );
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { title: body.title, description: body.description },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return NextResponse.json(
                { success: false, error: 'Elemento no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedItem });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Error al actualizar el elemento' },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json(
                { success: false, error: 'Elemento no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Error al eliminar el elemento' },
            { status: 500 }
        );
    }
}