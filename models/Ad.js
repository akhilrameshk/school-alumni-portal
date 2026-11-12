import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    imageUrl: { type: String, required: true },
    link: { type: String, trim: true, maxlength: 300 },
    startDate: Date,
    endDate: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model('Ad', AdSchema);
