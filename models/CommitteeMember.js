import mongoose from 'mongoose';

const CommitteeMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    role: { type: String, required: true, trim: true, maxlength: 60 },
    // who this person reports to in the tree; empty = top of the tree (President)
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommitteeMember', default: null },
    order: { type: Number, default: 0 },
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.CommitteeMember || mongoose.model('CommitteeMember', CommitteeMemberSchema);
