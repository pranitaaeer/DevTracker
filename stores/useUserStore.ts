'use client';

import { create } from 'zustand';

type User = { id: string; email: string; name?: string } | null;

type State = {
  user: User;
  setUser: (u: User) => void;
};

export const useStore = create<State>((set) => ({
  user: null,
  setUser: (u) => set({ user: u })
}));
