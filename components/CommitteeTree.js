'use client';
import { COMMITTEE } from '@/lib/config';
import { Person } from './Icons';

function Node({ n }) {
  return (
    <li>
      <div className={`nd ${n.tier || ''}`}>
        <div className="ph">{n.photo ? <img src={n.photo} alt="" /> : <Person />}</div>
        <b>{n.name}</b>
        <span>{n.role}</span>
      </div>
      {n.children && <ul>{n.children.map((c, i) => <Node key={i} n={c} />)}</ul>}
    </li>
  );
}

export default function CommitteeTree() {
  return <div className="tree"><ul><Node n={COMMITTEE} /></ul></div>;
}
