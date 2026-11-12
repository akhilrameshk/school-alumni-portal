import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['event', 'announcement'], default: 'event', index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    date: { type: Date, required: true, index: true },
    time: { type: String, trim: true, maxlength: 30 },
    venue: { type: String, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1500 },
    imageUrl: String,
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
