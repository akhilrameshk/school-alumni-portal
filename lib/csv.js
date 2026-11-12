// Small CSV helpers used by the bulk upload (browser + server) and the export (server).
export function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  text = String(text).replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = ''; rows.push(row); row = [];
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => String(x).trim() !== ''));
}

export function rowsToObjects(rows) {
  if (!rows.length) return [];
  const keys = rows[0].map((h) => String(h).trim().toLowerCase());
  return rows.slice(1).map((r) => {
    const o = Object.fromEntries(keys.map((k, i) => [k, r[i] ?? '']));
    if (o.batch === undefined && o.year !== undefined) o.batch = o.year;
    return o;
  });
}

const esc = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const toCSV = (headers, rows) => [headers.join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n');
export const MEMBER_TEMPLATE = 'name,batch,mobile,email,location,profession\r\n';
