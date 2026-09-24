import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);