'use client';
import { createContext, useContext, useMemo, useState } from 'react';
import JoinDialog from './JoinDialog';
import RenewDialog from './RenewDialog';

const Ctx = createContext({ openJoin() {}, openRenew() {} });
export const useDialogs = () => useContext(Ctx);

export function DialogProvider({ children }) {
  const [join, setJoin] = useState(false);
  const [renew, setRenew] = useState(false);
  const value = useMemo(() => ({ openJoin: () => setJoin(true), openRenew: () => setRenew(true) }), []);
  return (
    <Ctx.Provider value={value}>
      {children}
      <JoinDialog open={join} onClose={() => setJoin(false)} />
      <RenewDialog open={renew} onClose={() => setRenew(false)} />
    </Ctx.Provider>
  );
}
