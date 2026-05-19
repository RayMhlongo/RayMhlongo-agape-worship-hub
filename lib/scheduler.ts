import type { Instrument, Member, ServiceSchedule } from "@/types/domain";

function workload(member: Member) {
  return member.attendanceHistory.length;
}

export function generateBalancedSchedule({
  date,
  title,
  type = "Sunday Service",
  requiredInstruments,
  members,
  worshipLeader
}: {
  date: string;
  title: string;
  type?: ServiceSchedule["type"];
  requiredInstruments: Partial<Record<Instrument, number>>;
  members: Member[];
  worshipLeader: string;
}): ServiceSchedule {
  const selected = new Set<string>();
  const conflicts: string[] = [];

  for (const [instrument, count] of Object.entries(requiredInstruments) as [Instrument, number][]) {
    const candidates = members
      .filter((member) => member.instrument === instrument && member.availability.includes(date) && !member.unavailable.includes(date))
      .sort((a, b) => workload(a) - workload(b) || b.skillLevel - a.skillLevel);

    const chosen = candidates.slice(0, count);
    chosen.forEach((member) => selected.add(member.id));
    if (chosen.length < count) conflicts.push(`${instrument}: need ${count}, found ${chosen.length}`);
  }

  return {
    id: `schedule-${Date.now()}`,
    title,
    date,
    type,
    requiredInstruments,
    worshipLeader,
    members: Array.from(selected),
    status: conflicts.length ? "conflict" : "draft",
    notes: conflicts.length ? `Conflicts detected: ${conflicts.join("; ")}` : "Auto-generated with fair rotation."
  };
}

export function membersNotScheduledRecently(members: Member[], since = "2026-05-05") {
  return members.filter((member) => member.attendanceHistory.every((date) => date < since));
}
