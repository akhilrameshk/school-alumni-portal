import { MEMBERSHIP_DAYS } from './config';

// New validity = (current validity if still running, otherwise today) + MEMBERSHIP_DAYS.
export function extendFrom(current, days = MEMBERSHIP_DAYS) {
  const now = new Date();
  const base = current && new Date(current) > now ? new Date(current) : now;
  return new Date(base.getTime() + days * 864e5);
}

export const daysLeft = (d) => (d ? Math.ceil((new Date(d).getTime() - Date.now()) / 864e5) : null);
