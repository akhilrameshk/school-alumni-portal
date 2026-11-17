import { connectDB } from './db';
import { plain } from './serialize';
import Event from '@/models/Event';
import Photo from '@/models/Photo';
import Ad from '@/models/Ad';
import CommitteeMember from '@/models/CommitteeMember';

const EMPTY = { events: [], announcements: [], photos: [] };

// Data for the public home page. Never throws, so the site still renders if the database is down.
export async function getHomeData() {
  try {
    await connectDB();
    const now = new Date();
    const today = new Date(now.toISOString().slice(0, 10));
    const [events, announcements, photos] = await Promise.all([
      Event.find({ type: 'event', status: 'published', date: { $gte: today } }).sort({ date: 1 }).limit(3).lean(),
      Event.find({ type: 'announcement', status: 'published' }).sort({ date: -1 }).limit(4).lean(),
      Photo.find().sort({ createdAt: -1 }).limit(4).lean(),
    ]);
    return {
      events: events.map(plain), announcements: announcements.map(plain), photos: photos.map(plain),
    };
  } catch (err) {
    console.error('getHomeData', err);
    return EMPTY;
  }
}

export async function getGalleryData() {
  try {
    await connectDB();
    const photos = await Photo.find().sort({ createdAt: -1 }).limit(300).lean();
    return photos.map(plain);
  } catch (err) {
    console.error('getGalleryData', err);
    return [];
  }
}

// Active direct sponsor banners (the n-th banner is shown in ad spot n on every page).
export async function getActiveAds(limit = 4) {
  try {
    await connectDB();
    const now = new Date();
    const ads = await Ad.find({
      active: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    }).sort({ createdAt: -1 }).limit(limit).lean();
    return ads.map(plain);
  } catch (err) {
    console.error('getActiveAds', err);
    return [];
  }
}

// Data for the /events page: upcoming events, recent past events and announcements.
export async function getEventsData() {
  try {
    await connectDB();
    const today = new Date(new Date().toISOString().slice(0, 10));
    const [upcoming, past, announcements] = await Promise.all([
      Event.find({ type: 'event', status: 'published', date: { $gte: today } }).sort({ date: 1 }).limit(50).lean(),
      Event.find({ type: 'event', status: 'published', date: { $lt: today } }).sort({ date: -1 }).limit(12).lean(),
      Event.find({ type: 'announcement', status: 'published' }).sort({ date: -1 }).limit(12).lean(),
    ]);
    return { upcoming: upcoming.map(plain), past: past.map(plain), announcements: announcements.map(plain) };
  } catch (err) {
    console.error('getEventsData', err);
    return { upcoming: [], past: [], announcements: [] };
  }
}

// The committee tree for the public page, built from the admin's list. Returns null when nothing is added yet
// (the page then shows the placeholder structure from lib/config.js).
export async function getCommitteeTree() {
  try {
    await connectDB();
    const rows = (await CommitteeMember.find().sort({ order: 1, createdAt: 1 }).lean()).map(plain);
    if (!rows.length) return null;
    const known = new Set(rows.map((r) => r.id));
    const byParent = new Map();
    const roots = [];
    rows.forEach((r) => {
      if (!r.parentId || !known.has(r.parentId)) return roots.push(r);
      if (!byParent.has(r.parentId)) byParent.set(r.parentId, []);
      byParent.get(r.parentId).push(r);
    });
    const build = (r, depth) => ({
      name: r.name, role: r.role, photo: r.imageUrl,
      tier: depth === 0 ? 'top' : depth === 1 ? 'mid' : '',
      children: (byParent.get(r.id) || []).map((c) => build(c, depth + 1)),
    });
    const [first, ...rest] = roots;
    const top = build(first, 0);
    top.children.push(...rest.map((r) => build(r, 1)));
    return top;
  } catch (err) {
    console.error('getCommitteeTree', err);
    return null;
  }
}
