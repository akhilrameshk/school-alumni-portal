import mongoose from 'mongoose';
import { str } from './crud';

// Validates one committee member (shared by the create and update routes).
export function sanitizeCommittee(b) {
  const name = str(b.name, 80);
  const role = str(b.role, 60);
  const parentId = b.parentId ? String(b.parentId) : null;
  if (name.length < 2) return { error: 'Enter the name' };
  if (role.length < 2) return { error: 'Enter the position' };
  if (parentId && !mongoose.isValidObjectId(parentId)) return { error: 'Invalid "reports to" selection' };
  const order = Number.isFinite(Number(b.order)) ? Number(b.order) : 0;
  return { data: { name, role, parentId, order, imageUrl: str(b.imageUrl, 300) || undefined } };
}
