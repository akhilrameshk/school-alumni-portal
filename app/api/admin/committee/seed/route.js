import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { COMMITTEE } from '@/lib/config';
import CommitteeMember from '@/models/CommitteeMember';

// Creates the standard 11-member structure (placeholder names) when the committee is still empty.
export async function POST() {
  await connectDB();
  if ((await CommitteeMember.countDocuments()) > 0) {
    return NextResponse.json({ error: 'The committee already has members.' }, { status: 409 });
  }
  let count = 0;
  async function add(node, parentId, order) {
    const doc = await CommitteeMember.create({ name: node.name, role: node.role, parentId, order });
    count += 1;
    for (let i = 0; i < (node.children || []).length; i++) await add(node.children[i], doc._id, i + 1);
  }
  await add(COMMITTEE, null, 0);
  return NextResponse.json({ created: count }, { status: 201 });
}
