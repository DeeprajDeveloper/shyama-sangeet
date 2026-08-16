const DOCK_KEY  = "shyama-sangeet:queue-docked";
const BG_KEY    = "shyama-sangeet:bg-image";
const MINI_KEY  = "shyama-sangeet:player-minimized";
const THEME_KEY = "shyama-sangeet:color-theme";

/* ── Queue docked (uses useSyncExternalStore so multiple subscribers stay in sync) ── */

const listeners = new Set<() => void>();

export function subscribeQueueDocked(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getQueueDocked() {
  try {
    return localStorage.getItem(DOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function getQueueDockedServer() {
  return false;
}

export function writeQueueDocked(docked: boolean) {
  try {
    localStorage.setItem(DOCK_KEY, docked ? "1" : "0");
  } catch {
    /* ignore */
  }
  for (const listener of listeners) listener();
}

/* ── Background image ── */

export function readBgImage(fallback: string): string {
  try {
    return localStorage.getItem(BG_KEY) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeBgImage(src: string) {
  try {
    localStorage.setItem(BG_KEY, src);
  } catch {
    /* ignore */
  }
}

/* ── Color theme ── */

export type ColorTheme = "default" | "navy" | "crimson" | "midnight" | "ivory";

export function readColorTheme(): ColorTheme {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "navy" || v === "crimson" || v === "midnight" || v === "ivory") return v;
  } catch { /* ignore */ }
  return "default";
}

export function writeColorTheme(theme: ColorTheme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { /* ignore */ }
}

/* ── Player minimized ── */

export function readPlayerMinimized(): boolean {
  try {
    return localStorage.getItem(MINI_KEY) === "1";
  } catch {
    return false;
  }
}

export function writePlayerMinimized(minimized: boolean) {
  try {
    localStorage.setItem(MINI_KEY, minimized ? "1" : "0");
  } catch {
    /* ignore */
  }
}
