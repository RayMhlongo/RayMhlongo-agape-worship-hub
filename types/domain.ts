export type UserRole = "Admin" | "Worship Leader" | "Member Viewer";
export type Instrument =
  | "piano"
  | "keyboard"
  | "drums"
  | "bass"
  | "electric guitar"
  | "acoustic guitar"
  | "vocalist"
  | "sound engineer"
  | "media operator";

export type VocalistType = "lead" | "alto" | "soprano" | "tenor" | "baritone" | "none";

export type Song = {
  id: string;
  title: string;
  artist: string;
  originalKey: string;
  tempo: "slow" | "medium" | "fast";
  lyrics: string;
  chords: string;
  notes: string;
  tags: string[];
  bpm: number;
  preferredVocalist: string;
  category: string;
  duration: string;
  scriptureNotes: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mood: string;
  recentlyUsed?: string;
  favorite?: boolean;
};

export type Member = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  instrument: Instrument;
  vocalistType: VocalistType;
  availability: string[];
  unavailable: string[];
  recurringAvailability: string;
  skillLevel: 1 | 2 | 3 | 4 | 5;
  preferredKeys: string[];
  notes: string;
  attendanceHistory: string[];
};

export type ServiceSchedule = {
  id: string;
  title: string;
  date: string;
  type: "Sunday Service" | "Practice" | "Youth Service" | "Communion" | "Special Event";
  requiredInstruments: Partial<Record<Instrument, number>>;
  worshipLeader: string;
  members: string[];
  setlistId?: string;
  status: "draft" | "published" | "conflict";
  notes: string;
};

export type Setlist = {
  id: string;
  title: string;
  serviceDate: string;
  worshipLeader: string;
  songIds: string[];
  notes: string;
  template?: boolean;
};

export type PdfTemplate = {
  id: string;
  name: string;
  orientation: "portrait" | "landscape";
  theme: "light" | "dark";
  backgroundUrl?: string;
  logoPosition: "top-left" | "top-center" | "top-right";
  timetablePosition: "center" | "lower" | "right";
  footerText: string;
  watermark: string;
};
