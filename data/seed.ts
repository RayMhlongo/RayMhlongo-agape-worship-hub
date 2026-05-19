import type { Member, PdfTemplate, ServiceSchedule, Setlist, Song } from "@/types/domain";

export const seedSongs: Song[] = [
  {
    id: "song-1",
    title: "Great Are You Lord",
    artist: "All Sons & Daughters",
    originalKey: "G",
    tempo: "medium",
    lyrics: "You give life, You are love\nYou bring light to the darkness",
    chords: "[G] You give life [C] You are love\n[Em] You bring light [D] to the darkness",
    notes: "Warm opener or mid-set response. Keep the bridge restrained on communion weeks.",
    tags: ["adoration", "anthem", "congregational"],
    bpm: 72,
    preferredVocalist: "Nomsa M.",
    category: "Worship",
    duration: "5:10",
    scriptureNotes: "Psalm 145",
    difficulty: 2,
    mood: "soft",
    favorite: true,
    recentlyUsed: "2026-05-10"
  },
  {
    id: "song-2",
    title: "Goodness of God",
    artist: "Bethel Music",
    originalKey: "Ab",
    tempo: "slow",
    lyrics: "I love You Lord\nOh Your mercy never fails me",
    chords: "[Ab] I love You Lord\n[Db] Oh Your mercy never fails me",
    notes: "Works well after prayer. Transpose to G for lower vocal range.",
    tags: ["testimony", "communion", "soft"],
    bpm: 64,
    preferredVocalist: "Thabo K.",
    category: "Communion",
    duration: "4:55",
    scriptureNotes: "Lamentations 3:22-23",
    difficulty: 2,
    mood: "reflective",
    favorite: true,
    recentlyUsed: "2026-04-26"
  },
  {
    id: "song-3",
    title: "Lion and the Lamb",
    artist: "Leeland",
    originalKey: "B",
    tempo: "fast",
    lyrics: "He's coming on the clouds\nKings and kingdoms will bow down",
    chords: "[B] He's coming on the clouds\n[E] Kings and kingdoms will bow down",
    notes: "Strong opening song. Electric guitar needs confident lead line.",
    tags: ["opener", "high energy", "youth"],
    bpm: 90,
    preferredVocalist: "Lerato S.",
    category: "Praise",
    duration: "4:20",
    scriptureNotes: "Revelation 5",
    difficulty: 3,
    mood: "celebration",
    recentlyUsed: "2026-05-03"
  },
  {
    id: "song-4",
    title: "What A Beautiful Name",
    artist: "Hillsong Worship",
    originalKey: "D",
    tempo: "medium",
    lyrics: "You were the Word at the beginning\nOne with God the Lord Most High",
    chords: "[D] You were the Word at the beginning\n[G] One with God the Lord Most High",
    notes: "Keep piano-led first verse and add full band on bridge.",
    tags: ["jesus", "anthem", "closing"],
    bpm: 68,
    preferredVocalist: "Nomsa M.",
    category: "Worship",
    duration: "5:40",
    scriptureNotes: "Philippians 2",
    difficulty: 3,
    mood: "majestic"
  }
];

export const seedMembers: Member[] = [
  {
    id: "member-1",
    fullName: "Nomsa Mthembu",
    phone: "+27 82 000 0101",
    email: "nomsa@agape.local",
    role: "Worship Leader",
    instrument: "vocalist",
    vocalistType: "lead",
    availability: ["2026-05-24", "2026-05-31", "2026-06-07"],
    unavailable: ["2026-06-14"],
    recurringAvailability: "Every Sunday morning",
    skillLevel: 5,
    preferredKeys: ["G", "A", "Bb"],
    notes: "Excellent with reflective worship sets.",
    attendanceHistory: ["2026-05-10", "2026-05-17"]
  },
  {
    id: "member-2",
    fullName: "Thabo Khumalo",
    phone: "+27 82 000 0202",
    email: "thabo@agape.local",
    role: "Admin",
    instrument: "keyboard",
    vocalistType: "baritone",
    availability: ["2026-05-24", "2026-06-07"],
    unavailable: ["2026-05-31"],
    recurringAvailability: "First and third Sundays",
    skillLevel: 5,
    preferredKeys: ["F", "G", "Ab"],
    notes: "Can lead from keys when needed.",
    attendanceHistory: ["2026-04-26", "2026-05-17"]
  },
  {
    id: "member-3",
    fullName: "Lerato Sithole",
    phone: "+27 82 000 0303",
    email: "lerato@agape.local",
    role: "Member Viewer",
    instrument: "drums",
    vocalistType: "none",
    availability: ["2026-05-24", "2026-05-31", "2026-06-14"],
    unavailable: [],
    recurringAvailability: "Most Sundays",
    skillLevel: 4,
    preferredKeys: [],
    notes: "Great for youth sets and energetic praise.",
    attendanceHistory: ["2026-05-03"]
  },
  {
    id: "member-4",
    fullName: "Anele Dlamini",
    phone: "+27 82 000 0404",
    email: "anele@agape.local",
    role: "Member Viewer",
    instrument: "bass",
    vocalistType: "none",
    availability: ["2026-05-24", "2026-05-31", "2026-06-07"],
    unavailable: [],
    recurringAvailability: "Weekly",
    skillLevel: 3,
    preferredKeys: [],
    notes: "Pairs well with Lerato on drums.",
    attendanceHistory: ["2026-04-19", "2026-05-10"]
  },
  {
    id: "member-5",
    fullName: "Mpho Ndlovu",
    phone: "+27 82 000 0505",
    email: "mpho@agape.local",
    role: "Member Viewer",
    instrument: "acoustic guitar",
    vocalistType: "tenor",
    availability: ["2026-05-31", "2026-06-07", "2026-06-14"],
    unavailable: ["2026-05-24"],
    recurringAvailability: "Not available last Sunday of month",
    skillLevel: 4,
    preferredKeys: ["G", "D", "E"],
    notes: "Strong strummer and harmony vocal.",
    attendanceHistory: ["2026-04-26", "2026-05-17"]
  }
];

export const seedSetlists: Setlist[] = [
  {
    id: "set-1",
    title: "Soft Communion Flow",
    serviceDate: "2026-05-24",
    worshipLeader: "Nomsa Mthembu",
    songIds: ["song-2", "song-1", "song-4"],
    notes: "Start low, prayer after second chorus, end with full bridge.",
    template: true
  },
  {
    id: "set-2",
    title: "Youth Praise Night",
    serviceDate: "2026-05-31",
    worshipLeader: "Lerato Sithole",
    songIds: ["song-3", "song-1", "song-4"],
    notes: "High-energy opener, smooth key plan into worship.",
    template: false
  }
];

export const seedSchedules: ServiceSchedule[] = [
  {
    id: "schedule-1",
    title: "Sunday Celebration",
    date: "2026-05-24",
    type: "Sunday Service",
    requiredInstruments: { keyboard: 1, drums: 1, bass: 1, vocalist: 2 },
    worshipLeader: "Nomsa Mthembu",
    members: ["member-1", "member-2", "member-3", "member-4"],
    setlistId: "set-1",
    status: "published",
    notes: "Arrive 07:15, practice starts 07:30."
  },
  {
    id: "schedule-2",
    title: "Thursday Practice",
    date: "2026-05-21",
    type: "Practice",
    requiredInstruments: { keyboard: 1, drums: 1, bass: 1, "acoustic guitar": 1 },
    worshipLeader: "Thabo Khumalo",
    members: ["member-2", "member-3", "member-4", "member-5"],
    status: "draft",
    notes: "Work through communion transitions."
  }
];

export const seedPdfTemplates: PdfTemplate[] = [
  {
    id: "pdf-1",
    name: "Agape Premium Roster",
    orientation: "landscape",
    theme: "light",
    logoPosition: "top-left",
    timetablePosition: "center",
    footerText: "Agape Worship Department",
    watermark: "New Generation"
  }
];
