"use client";

import { useEffect, useRef, useState } from "react";
import type { PlaylistData } from "@/lib/types";
import { Film, Palette, X } from "lucide-react";
import { Header } from "./header";
import { NowPlaying } from "./now-playing";
import { PlayerBar } from "./player-bar";
import { PlayerProvider, usePlayer } from "./player-provider";
import { QueuePanel } from "./queue-panel";
import { ThemeProvider } from "./theme-provider";
import {
  readBgImage,
  writeBgImage,
  readColorTheme,
  writeColorTheme,
  type ColorTheme,
} from "@/lib/ui-storage";

const BG_IMAGES = [
  { id: "bg-1", src: "/bg-images/bg_video_scene-1.mp4", label: "Dakshineshwar" },
  { id: "bg-2", src: "/bg-images/bg_video_scene-2.mp4", label: "Maa Kali" },
  { id: "bg-3", src: "/bg-images/bg_video_scene-3.mp4", label: "Aarti" },
];

const COLOR_THEMES: { id: ColorTheme; label: string; dot: string }[] = [
  { id: "default",  label: "Golden",   dot: "linear-gradient(135deg,#180c12 40%,#d97706)" },
  { id: "navy",     label: "Kali",     dot: "linear-gradient(135deg,#0b1628 40%,#60a5fa)" },
  { id: "crimson",  label: "Hibiscus", dot: "linear-gradient(135deg,#1c0610 40%,#f43f5e)" },
  { id: "midnight", label: "Midnight", dot: "linear-gradient(135deg,#000 40%,#737373)" },
  { id: "ivory",    label: "Ivory",    dot: "linear-gradient(135deg,#2e2318 40%,#e0a832)" },
];

const THEME_CLASSES: ColorTheme[] = ["navy", "crimson", "midnight", "ivory"];

function applyColorTheme(theme: ColorTheme) {
  const html = document.documentElement;
  for (const cls of THEME_CLASSES) html.classList.remove(`theme-${cls}`);
  if (theme !== "default") html.classList.add(`theme-${theme}`);
}

function VideoBg({ src }: { src: string }) {
  return (
    <div className="image-bg">
      <video
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="image-bg__img"
      />
      <div className="image-bg__vignette" />
    </div>
  );
}

type PanelId = "scene" | "theme";

function PrefsBar({
  activeSrc,
  onSrcChange,
  activeTheme,
  onThemeChange,
}: {
  activeSrc: string;
  onSrcChange: (src: string) => void;
  activeTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
}) {
  const [open, setOpen] = useState<PanelId | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const toggle = (panel: PanelId) =>
    setOpen((o) => (o === panel ? null : panel));

  return (
    <div className="prefs-bar" ref={barRef}>
      <div className="prefs-bar__header">
        <span className="prefs-bar__header-label">Preferences</span>
      </div>
      {/* ── Scene popup ── */}
      {open === "scene" && (
        <div className="prefs-bar__popup" data-side="left">
          <div className="prefs-bar__popup-header">
            <span className="prefs-bar__popup-label">Background Scene</span>
            <button
              type="button"
              className="prefs-bar__popup-close"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X />
            </button>
          </div>
          <div className="prefs-bar__scene-swatches">
            {BG_IMAGES.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`prefs-bar__scene-swatch${activeSrc === v.src ? " prefs-bar__scene-swatch--active" : ""}`}
                onClick={() => { onSrcChange(v.src); setOpen(null); }}
                aria-pressed={activeSrc === v.src}
                title={v.label}
              >
                <video src={v.src} muted playsInline className="prefs-bar__scene-video" />
                <span className="prefs-bar__scene-label">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Theme popup ── */}
      {open === "theme" && (
        <div className="prefs-bar__popup" data-side="right">
          <div className="prefs-bar__popup-header">
            <span className="prefs-bar__popup-label">Color Theme</span>
            <button
              type="button"
              className="prefs-bar__popup-close"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X />
            </button>
          </div>
          <div className="prefs-bar__theme-swatches">
            {COLOR_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`prefs-bar__theme-swatch${activeTheme === t.id ? " prefs-bar__theme-swatch--active" : ""}`}
                onClick={() => onThemeChange(t.id)}
                aria-pressed={activeTheme === t.id}
                title={t.label}
              >
                <span className="prefs-bar__theme-dot" style={{ background: t.dot }} />
                <span className="prefs-bar__theme-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="prefs-bar__footer">
        {/* ── Buttons ── */}
        <button
          type="button"
          className={`prefs-bar__btn${open === "scene" ? " prefs-bar__btn--active" : ""}`}
          onClick={() => toggle("scene")}
          aria-pressed={open === "scene"}
          aria-expanded={open === "scene"}
          aria-label="Change background scene"
        >
          <Film />
          <span className="prefs-bar__btn-label">Scene</span>
        </button>

        <button
          type="button"
          className={`prefs-bar__btn${open === "theme" ? " prefs-bar__btn--active" : ""}`}
          onClick={() => toggle("theme")}
          aria-pressed={open === "theme"}
          aria-expanded={open === "theme"}
          aria-label="Change color theme"
        >
          <Palette />
          <span className="prefs-bar__btn-label">Theme</span>
        </button>
      </div>
    </div>
  );
}

function ShellLayout({ playlistId }: { playlistId: string }) {
  const { queueDocked } = usePlayer();
  const [activeSrc, setActiveSrcState] = useState(BG_IMAGES[0].src);
  const [activeTheme, setActiveThemeState] = useState<ColorTheme>("default");

  useEffect(() => {
    const savedSrc = readBgImage(BG_IMAGES[0].src);
    const validSrc = BG_IMAGES.find((v) => v.src === savedSrc)?.src ?? BG_IMAGES[0].src;
    setActiveSrcState(validSrc);

    const savedTheme = readColorTheme();
    setActiveThemeState(savedTheme);
    applyColorTheme(savedTheme);
  }, []);

  function setSrc(src: string) {
    setActiveSrcState(src);
    writeBgImage(src);
  }

  function setTheme(theme: ColorTheme) {
    setActiveThemeState(theme);
    writeColorTheme(theme);
    applyColorTheme(theme);
  }

  return (
    <div className={`grain shell${queueDocked ? " shell--queue-docked" : ""}`}>
      <VideoBg src={activeSrc} />
      <Header playlistId={playlistId} />
      <NowPlaying />

      <div className="player-zone">
        <PrefsBar
          activeSrc={activeSrc}
          onSrcChange={setSrc}
          activeTheme={activeTheme}
          onThemeChange={setTheme}
        />
        <PlayerBar playlistId={playlistId} />
      </div>

      <QueuePanel />
    </div>
  );
}

export function AppShell({ playlist }: { playlist: PlaylistData }) {
  return (
    <PlayerProvider
      playlistId={playlist.playlistId}
      initialTracks={playlist.tracks}
    >
      <ThemeProvider>
        <ShellLayout playlistId={playlist.playlistId} />
      </ThemeProvider>
    </PlayerProvider>
  );
}
