export function dayParts(iso) {
  const d = new Date(iso);
  return {
    day: String(d.getUTCDate()).padStart(2, '0'),
    mon: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
  };
}
export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '–';
export const rupees = (n) => (n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0');
export const dateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');

// Cloudinary images are delivered resized and in the best format (f_auto,q_auto). Other URLs are returned unchanged.
export const cld = (url, w = 800) =>
  /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//.test(url || '')
    ? url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${w}/`)
    : url;
