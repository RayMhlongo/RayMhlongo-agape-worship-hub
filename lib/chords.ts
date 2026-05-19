const keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export function transposeChordSheet(chords: string, fromKey: string, toKey: string) {
  const shift = keys.indexOf(toKey) - keys.indexOf(fromKey);
  if (keys.indexOf(fromKey) === -1 || keys.indexOf(toKey) === -1 || shift === 0) return chords;

  return chords.replace(/\[([A-G](?:#|b)?)(m|maj|min|sus|dim|aug|add)?([0-9])?(\/[A-G](?:#|b)?)?\]/g, (_, root, quality = "", extension = "", slash = "") => {
    const nextRoot = keys[(keys.indexOf(root) + shift + keys.length) % keys.length];
    const nextSlash = slash ? `/${keys[(keys.indexOf(slash.slice(1)) + shift + keys.length) % keys.length]}` : "";
    return `[${nextRoot}${quality}${extension}${nextSlash}]`;
  });
}

export function formatChordSheet(chords: string) {
  return chords.replace(/\[([^\]]+)\]/g, "<span class=\"font-bold text-[var(--brand-strong)]\">$1</span>");
}
