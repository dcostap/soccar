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

function replayMetadata(value) {
  const { text: _, ...metadata } = value;
  return metadata;
}

function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("soccar-replays", 3);
    request.onupgradeneeded = (event) => {
      const replays = request.result.objectStoreNames.contains("replays")
        ? request.transaction.objectStore("replays")
        : request.result.createObjectStore("replays");
      const history = request.result.objectStoreNames.contains("history")
        ? request.transaction.objectStore("history")
        : request.result.createObjectStore("history");
      if (event.oldVersion === 1) {
        const legacy = replays.get("latest");
        legacy.onsuccess = () => {
          if (!legacy.result?.text) return;
          const createdAt = Date.now();
          const id = `game:legacy-${createdAt}`;
          const value = {
            ...legacy.result,
            id,
            createdAt,
            updatedAt: createdAt,
          };
          replays.put(value, id);
          replays.put(id, "latest");
          history.put(replayMetadata(value), id);
        };
      } else if (event.oldVersion === 2) {
        const cursor = replays.openCursor();
        cursor.onsuccess = () => {
          const item = cursor.result;
          if (!item) return;
          if (item.value?.text && item.value?.id)
            history.put(replayMetadata(item.value), item.value.id);
          item.continue();
        };
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function records(values) {
  return values
    .filter((value) => value?.id)
    .sort(
      (a, b) =>
        (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0),
    );
}
export async function keepReplay(value) {
  if (!value?.id || !value?.text) throw new Error("Invalid replay record");
  const db = await database();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(["replays", "history"], "readwrite");
      const replays = tx.objectStore("replays");
      replays.put(value, value.id);
      replays.put(value.id, "latest");
      tx.objectStore("history").put(replayMetadata(value), value.id);
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
      const tx = db.transaction(["replays", "history"]);
      const store = tx.objectStore("replays");
      const request = store.get("latest");
      request.onsuccess = () => {
        if (request.result?.text) return resolve(request.result);
        if (typeof request.result === "string") {
          const replay = store.get(request.result);
          replay.onsuccess = () => resolve(replay.result ?? null);
          replay.onerror = () => reject(replay.error);
          return;
        }
        const all = tx.objectStore("history").getAll();
        all.onsuccess = () => {
          const latest = records(all.result)[0];
          if (!latest) return resolve(null);
          const replay = store.get(latest.id);
          replay.onsuccess = () => resolve(replay.result ?? null);
          replay.onerror = () => reject(replay.error);
        };
        all.onerror = () => reject(all.error);
      };
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
export async function replayHistory() {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("history").objectStore("history").getAll();
      request.onsuccess = () => resolve(records(request.result));
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
export async function storedReplay(id) {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("replays").objectStore("replays").get(id);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
export async function keepStoredFile(value) {
  if (!value?.id || !value?.text) throw new Error("Invalid local file");
  const db = await database();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("replays", "readwrite");
      tx.objectStore("replays").put(value, value.id);
      tx.oncomplete = resolve;
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export async function deleteStoredFile(id) {
  const db = await database();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("replays", "readwrite");
      tx.objectStore("replays").delete(id);
      tx.oncomplete = resolve;
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export async function deleteReplay(id) {
  const db = await database();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(["replays", "history"], "readwrite");
      const replays = tx.objectStore("replays");
      replays.delete(id);
      const history = tx.objectStore("history");
      history.delete(id);
      const all = history.getAll();
      all.onsuccess = () => {
        const latest = records(all.result)[0];
        if (latest) replays.put(latest.id, "latest");
        else replays.delete("latest");
      };
      tx.oncomplete = resolve;
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export function persistReplayStorage() {
  return navigator.storage?.persist?.().catch(() => false);
}
