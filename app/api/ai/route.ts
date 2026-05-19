import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/ai";
import { seedMembers, seedSchedules, seedSetlists, seedSongs } from "@/data/seed";

export const dynamic = "force-static";

export async function POST(request: NextRequest) {
  const { prompt } = (await request.json()) as { prompt?: string };
  const answer = await askGemini(prompt ?? "", {
    songs: seedSongs,
    members: seedMembers,
    schedules: seedSchedules,
    setlists: seedSetlists
  });
  return NextResponse.json({ answer });
}
