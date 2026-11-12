import mongoose from 'mongoose';

// Uploaded images are kept in MongoDB (small, compressed files) and served from /api/images/<id>.
const StoredImageSchema = new mongoose.Schema(
  { data: { type: Buffer, required: true }, contentType: { type: String, required: true }, size: Number },
  { timestamps: true }
);

export default mongoose.models.StoredImage || mongoose.model('StoredImage', StoredImageSchema);
