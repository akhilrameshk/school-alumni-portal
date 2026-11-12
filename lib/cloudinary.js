import crypto from 'crypto';

// Minimal signed Cloudinary client (no extra npm package needed).
const cfg = () => ({
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
  folder: process.env.CLOUDINARY_FOLDER || 'samanvayam',
});

export const cloudinaryEnabled = () => {
  const c = cfg();
  return Boolean(c.cloud && c.key && c.secret);
};

// Cloudinary signature: sha1 of the sorted "k=v&k=v" parameters + API secret
const sign = (params, secret) =>
  crypto.createHash('sha1')
    .update(Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&') + secret)
    .digest('hex');

export async function uploadToCloudinary(buffer, contentType) {
  const { cloud, key, secret, folder } = cfg();
  const timestamp = Math.floor(Date.now() / 1000);
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: contentType }), 'photo.jpg');
  form.append('api_key', key);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', sign({ folder, timestamp }, secret));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) throw new Error(data?.error?.message || 'Cloudinary upload failed');
  return { url: data.secure_url, publicId: data.public_id };
}

// https://res.cloudinary.com/<cloud>/image/upload/v123/<folder>/<name>.jpg  ->  <folder>/<name>
export function publicIdFromUrl(url) {
  const m = /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i.exec(String(url || ''));
  return m ? m[1] : null;
}

export async function deleteFromCloudinary(url) {
  if (!cloudinaryEnabled()) return;
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;
  const { cloud, key, secret } = cfg();
  const timestamp = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams({
    public_id: publicId, timestamp: String(timestamp), api_key: key,
    signature: sign({ public_id: publicId, timestamp }, secret),
  });
  await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, { method: 'POST', body }).catch(() => {});
}
