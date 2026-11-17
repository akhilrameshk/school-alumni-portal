'use client';
import { COMMITTEE } from '@/lib/config';
import { Person } from './Icons';
import { cld } from '@/lib/format';

function Node({ n }) {
  return (
    <li>
      <div className={`nd ${n.tier || ''}`}>
        <div className="ph">{n.photo ? <img src={cld(n.photo, 300)} alt="" /> : <Person />}</div>
        <b>{n.name}</b>
        <span>{n.role}</span>
      </div>
      {n.children?.length > 0 && <ul>{n.children.map((c, i) => <Node key={i} n={c} />)}</ul>}
    </li>
  );
}

// root comes from the admin's Committee tab; the placeholder structure is shown until members are added.
export default function CommitteeTree({ root }) {
  return <div className="tree"><ul><Node n={root || COMMITTEE} /></ul></div>;
}
