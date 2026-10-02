// Files stay on this device. Rust checks the state and the simulation version.
export const MAX_REPLAY_BYTES = 96 * 1024 * 1024;
export const SCENARIO_NAME = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function scenarioFile(text, name, description = "") {
  if (!SCENARIO_NAME.test(name))
    throw new Error(
      "Use a short name with letters, numbers, dashes, or underscores",
    );
  const body = text.replace(/^note\s*=.*\n?/gm, "").trimEnd();
  const line = /^clip\s*=\s*(.*)$/m.exec(body);
  const clip = line ? JSON.parse(line[1]) : null;
  const details = clip
    ? `# Brain controls car ${clip.car + 1} (internal ID ${clip.car}).\n` +
      `# Source: ${clip.source_team ? "orange" : "blue"} car at simulation tick ${clip.source_tick}.\n` +
      `# Other cars: ${clip.others ? "fixed reactive behavior" : "recorded controls"}.\n`
    : "";
  return `[${name}]\n${details}${description.trim() ? `note = ${JSON.stringify(description.trim())}\n` : ""}${body}\n`;
}

export function readScenarioFile(text) {
  const match = /^\s*\[([a-z0-9][a-z0-9_-]{0,63})\]\s*$/m.exec(text);
  if (!match) throw new Error("Choose a replay or a set piece file");
  const body = text.slice(match.index + match[0].length).trim();
  if (/^\s*\[/m.test(body)) throw new Error("Choose a file with one set piece");
  return { name: match[1], text: body };
}

function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("soccar-replays", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("replays");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function keepLatestReplay(value) {
  const db = await database();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("replays", "readwrite");
      tx.objectStore("replays").put(value, "latest");
      tx.oncomplete = resolve;
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export async function latestReplay() {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db
        .transaction("replays")
        .objectStore("replays")
        .get("latest");
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
