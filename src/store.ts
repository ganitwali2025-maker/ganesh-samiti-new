import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Member, Jama, Kharcha } from './types';

interface AppState {
  members: Member[];
  jamas: Jama[];
  kharchas: Kharcha[];
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addJama: (jama: Jama) => void;
  updateJama: (id: string, jama: Partial<Jama>) => void;
  deleteJama: (id: string) => void;
  addKharcha: (kharcha: Kharcha) => void;
  updateKharcha: (id: string, kharcha: Partial<Kharcha>) => void;
  deleteKharcha: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      members: [],
      jamas: [],
      kharchas: [],
      addMember: (member) => set((state) => ({ members: [...state.members, member] })),
      updateMember: (id, updatedMember) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...updatedMember } : m)),
        })),
      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          jamas: state.jamas.filter((j) => j.memberId !== id),
        })),
      addJama: (jama) => set((state) => ({ jamas: [...state.jamas, jama] })),
      updateJama: (id, updatedJama) =>
        set((state) => ({
          jamas: state.jamas.map((j) => (j.id === id ? { ...j, ...updatedJama } : j)),
        })),
      deleteJama: (id) => set((state) => ({ jamas: state.jamas.filter((j) => j.id !== id) })),
      addKharcha: (kharcha) => set((state) => ({ kharchas: [...state.kharchas, kharcha] })),
      updateKharcha: (id, updatedKharcha) =>
        set((state) => ({
          kharchas: state.kharchas.map((k) => (k.id === id ? { ...k, ...updatedKharcha } : k)),
        })),
      deleteKharcha: (id) => set((state) => ({ kharchas: state.kharchas.filter((k) => k.id !== id) })),
    }),
    {
      name: 'ganesh-samiti-storage',
    }
  )
);
