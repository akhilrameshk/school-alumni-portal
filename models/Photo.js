import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, trim: true, maxlength: 150 },
    album: { type: String, trim: true, maxlength: 60, default: 'General', index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
