"use client";

import { create } from "zustand";
import { seedMembers, seedPdfTemplates, seedSchedules, seedSetlists, seedSongs } from "@/data/seed";
import { generateBalancedSchedule } from "@/lib/scheduler";
import type { Member, PdfTemplate, ServiceSchedule, Setlist, Song, UserRole } from "@/types/domain";

type WorshipState = {
  role: UserRole;
  darkMode: boolean;
  songs: Song[];
  members: Member[];
  schedules: ServiceSchedule[];
  setlists: Setlist[];
  pdfTemplates: PdfTemplate[];
  activeSongId: string;
  search: string;
  setRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  setSearch: (search: string) => void;
  addSong: (song: Song) => void;
  updateSong: (song: Song) => void;
  deleteSong: (songId: string) => void;
  toggleFavorite: (songId: string) => void;
  addSchedule: () => void;
  updateSchedule: (schedule: ServiceSchedule) => void;
  addSetlist: (setlist: Setlist) => void;
  reorderSetlist: (setlistId: string, songIds: string[]) => void;
};

export const useWorshipStore = create<WorshipState>((set) => ({
  role: "Admin",
  darkMode: false,
  songs: seedSongs,
  members: seedMembers,
  schedules: seedSchedules,
  setlists: seedSetlists,
  pdfTemplates: seedPdfTemplates,
  activeSongId: "song-1",
  search: "",
  setRole: (role) => set({ role }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSearch: (search) => set({ search }),
  addSong: (song) => set((state) => ({ songs: [song, ...state.songs] })),
  updateSong: (song) => set((state) => ({ songs: state.songs.map((item) => (item.id === song.id ? song : item)) })),
  deleteSong: (songId) => set((state) => ({ songs: state.songs.filter((song) => song.id !== songId) })),
  toggleFavorite: (songId) =>
    set((state) => ({ songs: state.songs.map((song) => (song.id === songId ? { ...song, favorite: !song.favorite } : song)) })),
  addSchedule: () =>
    set((state) => ({
      schedules: [
        generateBalancedSchedule({
          date: "2026-06-07",
          title: "Auto Generated Sunday Team",
          requiredInstruments: { keyboard: 1, drums: 1, bass: 1, vocalist: 2 },
          members: state.members,
          worshipLeader: "Nomsa Mthembu"
        }),
        ...state.schedules
      ]
    })),
  updateSchedule: (schedule) =>
    set((state) => ({ schedules: state.schedules.map((item) => (item.id === schedule.id ? schedule : item)) })),
  addSetlist: (setlist) => set((state) => ({ setlists: [setlist, ...state.setlists] })),
  reorderSetlist: (setlistId, songIds) =>
    set((state) => ({
      setlists: state.setlists.map((setlist) => (setlist.id === setlistId ? { ...setlist, songIds } : setlist))
    }))
}));
