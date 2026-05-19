import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Member, ServiceSchedule, Setlist, Song } from "@/types/domain";

export type AiContext = {
  songs: Song[];
  members: Member[];
  schedules: ServiceSchedule[];
  setlists: Setlist[];
};

export function buildLocalAssistantAnswer(prompt: string, context: AiContext) {
  const query = prompt.toLowerCase();
  if (query.includes("songs in")) {
    const key = prompt.match(/\b([A-G](?:#|b)?)\b/)?.[1];
    const songs = context.songs.filter((song) => song.originalKey === key);
    return songs.length ? `Songs in ${key}: ${songs.map((song) => song.title).join(", ")}.` : `I could not find songs in ${key ?? "that key"} yet.`;
  }
  if (query.includes("not played") || query.includes("2 weeks")) {
    const names = context.members
      .filter((member) => member.attendanceHistory.every((date) => date < "2026-05-05"))
      .map((member) => member.fullName);
    return names.length ? `${names.join(", ")} have not played in the last two weeks.` : "Everyone in the seed roster has played recently.";
  }
  if (query.includes("communion") || query.includes("soft")) {
    return context.songs
      .filter((song) => song.mood.includes("soft") || song.category === "Communion" || song.tags.includes("soft"))
      .map((song) => `${song.title} in ${song.originalKey}`)
      .join(", ");
  }
  if (query.includes("balanced") || query.includes("4 song")) {
    const opener = context.songs.find((song) => song.tags.includes("opener")) ?? context.songs[0];
    const soft = context.songs.find((song) => song.mood === "reflective") ?? context.songs[1];
    const anthem = context.songs.find((song) => song.tags.includes("anthem")) ?? context.songs[2];
    const close = context.songs.find((song) => song.tags.includes("closing")) ?? context.songs[3];
    return `Balanced flow: ${opener.title} -> ${anthem.title} -> ${soft.title} -> ${close.title}. Keep keys close and use prayer between songs 2 and 3.`;
  }
  return "I can recommend songs by key, build set flows, check availability, identify rotation gaps, and answer schedule questions from the worship data.";
}

export async function askGemini(prompt: string, context: AiContext) {
  if (!process.env.GEMINI_API_KEY) return buildLocalAssistantAnswer(prompt, context);
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "You are a church worship department assistant. Use only the provided app data unless clearly making a suggestion.",
    JSON.stringify(context),
    prompt
  ]);
  return result.response.text();
}
