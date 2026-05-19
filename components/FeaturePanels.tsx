"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarCheck, Clock3, Guitar, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { buildLocalAssistantAnswer } from "@/lib/ai";
import { transposeChordSheet } from "@/lib/chords";
import { useWorshipStore } from "@/store/useWorshipStore";
import type { Song } from "@/types/domain";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`premium-panel rounded-[28px] p-5 md:p-6 ${className}`}>{children}</section>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--background)]/50 p-4">
      <Icon size={18} className="text-[var(--brand-strong)]" />
      <p className="mt-4 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-[var(--muted)]">{label}</p>
    </div>
  );
}

export function DashboardPanel({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { schedules, members, songs, addSchedule } = useWorshipStore();
  const upcoming = schedules[0];
  const scheduled = upcoming.members.map((id) => members.find((member) => member.id === id)?.fullName).filter(Boolean);

  return (
    <div className="grid gap-4">
      <section className="premium-panel overflow-hidden rounded-[32px]">
        <div className="grid gap-8 p-6 md:grid-cols-[1.15fr_.85fr] md:p-9">
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-[var(--line)]"
            >
              <Image src="/agape-logo.jpeg" alt="Agape logo" width={72} height={72} className="rounded-full object-cover" />
            </motion.div>
            <p className="text-sm font-black uppercase text-[var(--brand-strong)]">Upcoming service</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] md:text-7xl">{upcoming.title}</h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[var(--muted)]">
              {upcoming.date} · {upcoming.notes} Smooth schedule planning, setlist flow, PDFs, and live team updates in one elegant workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={addSchedule} className="focus-ring rounded-full bg-[var(--foreground)] px-5 py-4 text-sm font-black text-[var(--background)] transition hover:scale-[1.02]">
                Generate schedule
              </button>
              <button onClick={() => onNavigate("songs")} className="focus-ring rounded-full border border-[var(--line)] px-5 py-4 text-sm font-black transition hover:bg-[var(--foreground)] hover:text-[var(--background)]">
                Quick song search
              </button>
            </div>
          </div>
          <div className="grid content-start gap-3">
            <Stat icon={Clock3} label="Service countdown" value="5d 03h" />
            <Stat icon={Users} label="Scheduled members" value={String(scheduled.length)} />
            <Stat icon={Guitar} label="Song library" value={String(songs.length)} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-[var(--muted)]">Recent schedules</p>
              <h3 className="text-2xl font-black">Roster movement</h3>
            </div>
            <CalendarCheck className="text-[var(--brand-strong)]" />
          </div>
          <div className="mt-5 grid gap-3">
            {schedules.slice(0, 4).map((schedule) => (
              <div key={schedule.id} className="grid gap-3 rounded-2xl border border-[var(--line)] p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-black">{schedule.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{schedule.date} · {schedule.type}</p>
                </div>
                <span className="w-fit rounded-full bg-[var(--foreground)] px-3 py-2 text-xs font-black text-[var(--background)]">{schedule.status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-black uppercase text-[var(--muted)]">Recently added songs</p>
          <div className="mt-5 grid gap-4">
            {songs.slice(0, 4).map((song) => (
              <div key={song.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black">{song.title}</p>
                  <p className="text-sm text-[var(--muted)]">{song.originalKey} · {song.bpm} BPM</p>
                </div>
                <span className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-bold">{song.category}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SongsPanel() {
  const { songs, search, setSearch, toggleFavorite, deleteSong, addSong, role } = useWorshipStore();
  const [key, setKey] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Song>(songs[0]);
  const [targetKey, setTargetKey] = useState("G");

  const filtered = songs.filter((song) => {
    const query = `${song.title} ${song.artist} ${song.tags.join(" ")} ${song.preferredVocalist}`.toLowerCase();
    return query.includes(search.toLowerCase()) && (key === "All" || song.originalKey === key) && (category === "All" || song.category === category);
  });

  const canEdit = role !== "Member Viewer";

  return (
    <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--muted)]">Song library</p>
            <h2 className="text-3xl font-black">Search, filter, transpose</h2>
          </div>
          {canEdit ? (
            <button
              onClick={() =>
                addSong({
                  id: `song-${Date.now()}`,
                  title: "New Worship Song",
                  artist: "Agape Team",
                  originalKey: "G",
                  tempo: "medium",
                  lyrics: "Verse lyrics...",
                  chords: "[G] Verse [C] lyrics...",
                  notes: "Add arrangement notes.",
                  tags: ["new"],
                  bpm: 72,
                  preferredVocalist: "Unassigned",
                  category: "Worship",
                  duration: "4:00",
                  scriptureNotes: "",
                  difficulty: 2,
                  mood: "warm"
                })
              }
              className="rounded-full bg-[var(--foreground)] px-4 py-3 text-xs font-black text-[var(--background)]"
            >
              Add song
            </button>
          ) : null}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="relative md:col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search songs" className="focus-ring w-full rounded-full border border-[var(--line)] bg-transparent py-3 pl-11 pr-4 text-sm font-semibold" />
          </label>
          <select value={key} onChange={(event) => setKey(event.target.value)} className="focus-ring rounded-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm font-bold">
            {["All", "G", "Ab", "B", "D"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="focus-ring rounded-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm font-bold">
            {["All", "Worship", "Praise", "Communion"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="mt-5 grid max-h-[620px] gap-3 overflow-auto pr-1 no-scrollbar">
          {filtered.map((song) => (
            <button key={song.id} onClick={() => setSelected(song)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${selected.id === song.id ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]" : "border-[var(--line)] bg-[var(--background)]/45"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black">{song.title}</p>
                  <p className="mt-1 text-sm opacity-70">{song.artist} · {song.originalKey} · {song.bpm} BPM</p>
                </div>
                <span>{song.favorite ? "★" : "☆"}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {song.tags.map((tag) => <span key={tag} className="rounded-full border border-current px-2 py-1 text-[10px] font-bold uppercase opacity-70">{tag}</span>)}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--muted)]">Chord sheet</p>
            <h2 className="text-3xl font-black">{selected.title}</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{selected.artist} · {selected.category} · difficulty {selected.difficulty}/5</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleFavorite(selected.id)} className="rounded-full border border-[var(--line)] px-4 py-3 text-xs font-black">Favorite</button>
            {canEdit ? <button onClick={() => deleteSong(selected.id)} className="rounded-full bg-[var(--foreground)] px-4 py-3 text-xs font-black text-[var(--background)]">Delete</button> : null}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <select value={targetKey} onChange={(event) => setTargetKey(event.target.value)} className="focus-ring rounded-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm font-bold">
            {["C", "D", "Eb", "E", "F", "G", "Ab", "A", "Bb", "B"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button onClick={() => window.print()} className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-black">Print sheet</button>
          <button className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-black">Fullscreen lyrics</button>
        </div>
        <pre className="mt-6 min-h-[320px] whitespace-pre-wrap rounded-3xl border border-[var(--line)] bg-[var(--background)]/60 p-5 text-sm font-bold leading-8">
          {transposeChordSheet(selected.chords, selected.originalKey, targetKey)}
        </pre>
        <div className="mt-5 rounded-3xl border border-[var(--line)] p-5">
          <p className="text-xs font-black uppercase text-[var(--muted)]">Notes and scripture</p>
          <p className="mt-3 font-semibold leading-7">{selected.notes}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{selected.scriptureNotes}</p>
        </div>
      </Card>
    </div>
  );
}

function SortableSong({ song }: { song: Song }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: song.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners} className="cursor-grab rounded-2xl border border-[var(--line)] bg-[var(--background)]/55 p-4">
      <p className="font-black">{song.title}</p>
      <p className="text-sm text-[var(--muted)]">{song.originalKey} · {song.duration} · {song.mood}</p>
    </div>
  );
}

export function SetlistsPanel() {
  const { setlists, songs, reorderSetlist } = useWorshipStore();
  const [activeSetlist, setActiveSetlist] = useState(setlists[0].id);
  const setlist = setlists.find((item) => item.id === activeSetlist) ?? setlists[0];
  const setlistSongs = setlist.songIds.map((id) => songs.find((song) => song.id === id)).filter(Boolean) as Song[];

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = setlist.songIds.indexOf(String(active.id));
    const newIndex = setlist.songIds.indexOf(String(over.id));
    reorderSetlist(setlist.id, arrayMove(setlist.songIds, oldIndex, newIndex));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
      <Card>
        <p className="text-xs font-black uppercase text-[var(--muted)]">Setlist templates</p>
        <h2 className="text-3xl font-black">Plan worship flow</h2>
        <div className="mt-5 grid gap-3">
          {setlists.map((item) => (
            <button key={item.id} onClick={() => setActiveSetlist(item.id)} className={`rounded-2xl border p-4 text-left ${item.id === setlist.id ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]" : "border-[var(--line)]"}`}>
              <p className="font-black">{item.title}</p>
              <p className="mt-1 text-sm opacity-70">{item.serviceDate} · {item.worshipLeader}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--muted)]">Drag to reorder</p>
            <h2 className="text-3xl font-black">{setlist.title}</h2>
          </div>
          <button className="rounded-full bg-[var(--foreground)] px-4 py-3 text-xs font-black text-[var(--background)]">Duplicate</button>
        </div>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={setlist.songIds} strategy={verticalListSortingStrategy}>
            <div className="mt-6 grid gap-3">
              {setlistSongs.map((song) => <SortableSong key={song.id} song={song} />)}
            </div>
          </SortableContext>
        </DndContext>
        <p className="mt-5 rounded-2xl border border-[var(--line)] p-4 text-sm font-semibold text-[var(--muted)]">{setlist.notes}</p>
      </Card>
    </div>
  );
}

export function SchedulePanel() {
  const { schedules, members, addSchedule } = useWorshipStore();
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-[var(--muted)]">Scheduling engine</p>
          <h2 className="text-3xl font-black">Balanced monthly roster</h2>
        </div>
        <button onClick={addSchedule} className="rounded-full bg-[var(--foreground)] px-5 py-4 text-sm font-black text-[var(--background)]">Auto assign</button>
      </div>
      <div className="mt-6 grid gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="rounded-3xl border border-[var(--line)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-black">{schedule.title}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{schedule.date} · {schedule.type} · Leader: {schedule.worshipLeader}</p>
              </div>
              <span className={`rounded-full px-3 py-2 text-xs font-black ${schedule.status === "conflict" ? "bg-red-500 text-white" : "bg-[var(--foreground)] text-[var(--background)]"}`}>{schedule.status}</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {schedule.members.map((memberId) => {
                const member = members.find((item) => item.id === memberId);
                return member ? (
                  <div key={member.id} className="rounded-2xl bg-[var(--background)]/60 p-4">
                    <p className="font-black">{member.fullName}</p>
                    <p className="text-sm text-[var(--muted)]">{member.instrument} · skill {member.skillLevel}/5</p>
                  </div>
                ) : null;
              })}
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--muted)]">{schedule.notes}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MembersPanel() {
  const { members } = useWorshipStore();
  return (
    <Card>
      <p className="text-xs font-black uppercase text-[var(--muted)]">People and roles</p>
      <h2 className="text-3xl font-black">Team directory</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <div key={member.id} className="rounded-3xl border border-[var(--line)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-black">{member.fullName}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{member.email}</p>
              </div>
              <ShieldCheck className="text-[var(--brand-strong)]" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[member.role, member.instrument, member.vocalistType, `skill ${member.skillLevel}`].map((item) => (
                <span key={item} className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-black">{item}</span>
              ))}
            </div>
            <p className="mt-5 text-sm font-semibold leading-6 text-[var(--muted)]">{member.notes}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AvailabilityPanel() {
  const { members } = useWorshipStore();
  return (
    <Card>
      <p className="text-xs font-black uppercase text-[var(--muted)]">Availability</p>
      <h2 className="text-3xl font-black">Dates, conflicts, recurring rules</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {members.map((member) => (
          <div key={member.id} className="rounded-3xl border border-[var(--line)] p-5">
            <p className="font-black">{member.fullName}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{member.recurringAvailability}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-green-500/10 p-4">
                <p className="text-xs font-black uppercase">Available</p>
                <p className="mt-2 text-sm font-semibold">{member.availability.join(", ")}</p>
              </div>
              <div className="rounded-2xl bg-red-500/10 p-4">
                <p className="text-xs font-black uppercase">Unavailable</p>
                <p className="mt-2 text-sm font-semibold">{member.unavailable.join(", ") || "None logged"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PdfStudioPanel() {
  const { pdfTemplates, schedules } = useWorshipStore();
  const [orientation, setOrientation] = useState("landscape");
  return (
    <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <p className="text-xs font-black uppercase text-[var(--muted)]">PDF Studio</p>
        <h2 className="text-3xl font-black">Premium branded exports</h2>
        <div className="mt-6 grid gap-3">
          {["monthly roster", "weekly roster", "practice schedule", "setlist", "chord sheet", "vocalist sheet"].map((item) => (
            <button key={item} className="rounded-2xl border border-[var(--line)] p-4 text-left text-sm font-black capitalize transition hover:bg-[var(--foreground)] hover:text-[var(--background)]">{item}</button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[var(--muted)]">{pdfTemplates[0].name}</p>
            <h2 className="text-3xl font-black">Live PDF preview</h2>
          </div>
          <a href={`/api/pdf?type=monthly&orientation=${orientation}`} target="_blank" className="rounded-full bg-[var(--foreground)] px-4 py-3 text-xs font-black text-[var(--background)]">Download PDF</a>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <select value={orientation} onChange={(event) => setOrientation(event.target.value)} className="rounded-full border border-[var(--line)] bg-transparent px-4 py-3 text-sm font-bold">
            <option>landscape</option>
            <option>portrait</option>
          </select>
          <button className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-black">Upload background</button>
          <button className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-black">Print directly</button>
        </div>
        <div className="mt-6 overflow-hidden rounded-[28px] border border-[var(--line)] bg-white p-6 text-black shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black uppercase text-sky-700">Agape Worship Department</p>
              <h3 className="mt-2 text-4xl font-black">Monthly Roster</h3>
            </div>
            <Image src="/agape-logo.jpeg" alt="Agape logo" width={72} height={72} className="rounded-full object-cover" />
          </div>
          <div className="mt-8 grid gap-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="grid gap-2 rounded-2xl border border-black/10 p-4 md:grid-cols-[1fr_auto]">
                <p className="font-black">{schedule.title}</p>
                <p className="font-bold text-black/60">{schedule.date}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs font-bold text-black/45">New Generation · Agape Worship Hub</p>
        </div>
      </Card>
    </div>
  );
}

export function AiAssistantPanel() {
  const { songs, members, schedules, setlists } = useWorshipStore();
  const [prompt, setPrompt] = useState("Create a balanced 4 song worship set");
  const [answer, setAnswer] = useState("Ask about keys, transitions, availability, fair rotation, or service planning.");
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-[var(--muted)]">Gemini or Groq ready</p>
          <h2 className="text-3xl font-black">Smart worship assistant</h2>
        </div>
        <Sparkles className="text-[var(--brand-strong)]" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <div className="rounded-3xl border border-[var(--line)] p-4">
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="focus-ring min-h-[160px] w-full resize-none rounded-2xl border border-[var(--line)] bg-transparent p-4 font-semibold" />
          <button onClick={() => setAnswer(buildLocalAssistantAnswer(prompt, { songs, members, schedules, setlists }))} className="mt-3 rounded-full bg-[var(--foreground)] px-5 py-4 text-sm font-black text-[var(--background)]">Ask assistant</button>
        </div>
        <div className="rounded-3xl bg-[var(--foreground)] p-5 text-[var(--background)]">
          <p className="text-xs font-black uppercase opacity-60">Answer</p>
          <p className="mt-4 text-lg font-bold leading-8">{answer}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {["Show songs in G", "Who has not played in 2 weeks?", "Suggest soft worship songs for communion", "Create a youth worship set"].map((item) => (
          <button key={item} onClick={() => setPrompt(item)} className="rounded-full border border-[var(--line)] px-4 py-3 text-xs font-black">{item}</button>
        ))}
      </div>
    </Card>
  );
}

export function BackupSettingsPanel({ mode }: { mode: "backup" | "settings" }) {
  const { songs, schedules, members, setlists } = useWorshipStore();
  const payload = useMemo(() => JSON.stringify({ songs, schedules, members, setlists }, null, 2), [songs, schedules, members, setlists]);
  return (
    <Card>
      <p className="text-xs font-black uppercase text-[var(--muted)]">{mode === "backup" ? "Cloud backup" : "Settings"}</p>
      <h2 className="text-3xl font-black">{mode === "backup" ? "Firebase sync blueprint" : "Church customization"}</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--line)] p-5">
          <p className="font-black">Realtime collections</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[var(--muted)]">Songs, schedules, members, setlists, PDF templates, and uploaded backgrounds are wired for Firestore and Storage once environment variables are supplied.</p>
          <div className="mt-5 grid gap-3">
            {["Google Login", "Email and Password", "Role based access", "Firestore realtime", "Storage uploads", "Hosting support"].map((item) => (
              <div key={item} className="rounded-2xl bg-[var(--background)]/60 p-4 font-bold">{item}</div>
            ))}
          </div>
        </div>
        <textarea readOnly value={payload} className="min-h-[420px] rounded-3xl border border-[var(--line)] bg-[var(--background)]/60 p-5 text-xs font-semibold leading-5" />
      </div>
    </Card>
  );
}
