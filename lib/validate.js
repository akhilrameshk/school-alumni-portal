import { FIRST_BATCH, LAST_BATCH, PROFESSIONS } from './config';

const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);

// strictProfession: the public registration form must pick a job from the dropdown ("Other" needs a description).
// Admin screens and CSV uploads accept any job text.
export function validateMember(b, { requireConsent = true, strictProfession = false } = {}) {
  const data = {
    name: clean(b.name, 100),
    batch: Number(b.batch),
    mobile: clean(b.mobile, 20).replace(/[\s-]/g, ''),
    email: clean(b.email, 120).toLowerCase(),
    location: clean(b.location, 100),
    profession: clean(b.profession, 100),
  };
  const professionOther = clean(b.professionOther, 100);
  const errors = {};
  if (data.name.length < 2) errors.name = 'Enter the full name';
  if (!Number.isInteger(data.batch) || data.batch < FIRST_BATCH || data.batch > LAST_BATCH)
    errors.batch = `Batch must be ${FIRST_BATCH}–${LAST_BATCH}`;
  if (!/^\+?\d{8,15}$/.test(data.mobile)) errors.mobile = 'Enter a valid mobile / WhatsApp number';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email';
  if (data.location.length < 2) errors.location = 'Enter the current location';
  if (strictProfession) {
    if (!PROFESSIONS.includes(data.profession)) errors.profession = 'Select your profession';
    else if (data.profession === 'Other' && professionOther.length < 2) errors.professionOther = 'Please tell us your profession';
  } else if (data.profession.length < 2) errors.profession = 'Enter the profession';
  if (data.profession === 'Other' && professionOther) data.professionOther = professionOther;
  if (requireConsent && b.consent !== true) errors.consent = 'Please accept to continue';
  return { data, errors, ok: Object.keys(errors).length === 0 };
}
