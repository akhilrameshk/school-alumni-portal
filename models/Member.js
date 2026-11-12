import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    amount: Number,
    paymentId: String,
    orderId: String,
    purpose: { type: String, enum: ['registration', 'renewal', 'offline'], default: 'registration' },
    paidAt: Date,
  },
  { _id: false }
);

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    batch: { type: Number, required: true, index: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    consent: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    pendingOrder: { orderId: String, purpose: String, amount: Number },
    payments: [PaymentSchema],
    totalPaid: { type: Number, default: 0 },
    lastPaidAmount: { type: Number, default: 0 },
    lastPaidAt: Date,
    validUntil: Date, // end of the current subscription
  },
  { timestamps: true }
);

MemberSchema.index({ name: 'text', email: 'text', mobile: 'text' });
MemberSchema.index({ 'pendingOrder.orderId': 1 });

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
