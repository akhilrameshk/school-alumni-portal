import { Box } from '@mui/material';

// School building, banyan trees and a group of friends holding hands, drawn as SVG.
function People({ xs, Hs, g, girls, wave, color }) {
  const pos = [];
  const bodies = xs.map((cx, i) => {
    const H = Hs[i], r = H * 0.1, W = H * 0.24, lw = W * 0.38;
    const hy = g - H + r, sh = g - H + 2 * r + 8, hip = g - H * 0.46;
    pos.push({ cx, sh, W, H });
    return (
      <g key={i}>
        {girls.has(i) && <ellipse cx={cx} cy={hy + r * 0.6} rx={r * 1.18} ry={r * 1.55} />}
        <rect x={cx - W * 0.46} y={hip} width={lw} height={g - hip} rx={lw / 2} />
        <rect x={cx + W * 0.08} y={hip} width={lw} height={g - hip} rx={lw / 2} />
        <rect x={cx - W / 2} y={sh} width={W} height={hip - sh + 8} rx={W * 0.32} />
        {girls.has(i) && <polygon points={`${cx - W * 0.5},${hip - 6} ${cx + W * 0.5},${hip - 6} ${cx + W * 0.82},${hip + H * 0.13} ${cx - W * 0.82},${hip + H * 0.13}`} />}
        <circle cx={cx} cy={hy} r={r} />
      </g>
    );
  });
  const arms = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = pos[i], b = pos[i + 1];
    arms.push(<line key={`a${i}`} x1={a.cx} y1={a.sh + 8} x2={b.cx} y2={b.sh + 8} strokeWidth={a.H * 0.065} />);
  }
  wave.forEach((i) => {
    const p = pos[i];
    arms.push(<line key={`w${i}`} x1={p.cx + p.W * 0.38} y1={p.sh + 6} x2={p.cx + p.W} y2={p.sh - p.H * 0.3} strokeWidth={p.H * 0.065} />);
  });
  return (<><g fill={color}>{bodies}</g><g stroke={color} strokeLinecap="round" fill="none">{arms}</g></>);
}

function Tree({ cx, top, sc }) {
  const blobs = [[0, 0, 110], [-90, 40, 84], [90, 36, 88], [-40, -50, 74], [50, -54, 72], [-140, 86, 58], [140, 82, 60], [0, 66, 92]];
  return (
    <g fill="#0c2a1a">
      {blobs.map(([x, y, r], i) => <circle key={i} cx={cx + x * sc} cy={top + y * sc} r={r * sc} />)}
      <path d={`M${cx - 22 * sc} 470 L${cx - 8 * sc} ${top + 100 * sc} L${cx + 8 * sc} ${top + 100 * sc} L${cx + 22 * sc} 470Z`} />
    </g>
  );
}

function Building() {
  const winsMain = [50, 84, 118, 310, 344, 378].flatMap((x) => [366, 404].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width={18} height={24} rx={3} />));
  const winsWing = [-14, 14, 420, 450, 480].map((x) => <rect key={x} x={x} y={396} width={16} height={22} rx={3} />);
  const winsCenter = [168, 260].map((x) => <rect key={x} x={x} y={338} width={18} height={26} rx={3} />);
  return (
    <>
      <g fill="#d3ab3e">
        <rect x="30" y="352" width="380" height="103" /><rect x="150" y="318" width="140" height="137" />
        <rect x="400" y="380" width="110" height="75" /><rect x="-30" y="380" width="70" height="75" />
        <rect x="138" y="310" width="164" height="10" /><circle cx="220" cy="294" r="15" />
      </g>
      <g fill="#8a6d1a">{winsMain}{winsWing}{winsCenter}<rect x="200" y="406" width="40" height="49" rx="2" /><rect x="170" y="324" width="100" height="10" rx="2" /></g>
      <circle cx="220" cy="294" r="9" fill="#f3e2a0" /><path d="M220 288v7l5 3" stroke="#8a6d1a" strokeWidth="2" fill="none" />
      <rect x="186" y="450" width="68" height="5" fill="#a2802a" /><path d="M-30 455h560" stroke="#a2802a" strokeWidth="6" />
    </>
  );
}

// Fills the bottom of its (position: relative) parent.
export default function Scene() {
  return (
    <Box component="svg" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true"
      sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: { xs: 'auto', md: 520 }, aspectRatio: { xs: '1440 / 520', md: 'auto' } }}>
      {[[640, 330, 70, 16], [700, 322, 50, 13], [1100, 300, 80, 17]].map(([x, y, rx, ry]) => <ellipse key={x} cx={x} cy={y} rx={rx} ry={ry} fill="rgba(255,255,255,.1)" />)}
      <path d="M0 450 C260 430 560 445 800 452 C1040 458 1240 430 1440 440 L1440 520 L0 520Z" fill="#134025" />
      <Building />
      <Tree cx={1340} top={230} sc={1} />
      <Tree cx={930} top={330} sc={0.5} />
      <People xs={Array.from({ length: 8 }, (_, i) => 1000 + i * 38)} Hs={[78, 86, 74, 90, 80, 84, 76, 88]} g={452} girls={new Set([1, 3, 6])} wave={new Set([4])} color="#0b2417" />
      <path d="M0 468 C300 456 700 470 1000 462 C1200 458 1340 464 1440 460 L1440 520 L0 520Z" fill="#0d2d1b" />
    </Box>
  );
}
