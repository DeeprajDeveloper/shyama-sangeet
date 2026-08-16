"use client";

import { useEffect, useState } from "react";
import { thumbnailUrl } from "@/lib/constants";
import { formatTime } from "@/lib/format";
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Maximize,
  Minimize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayer } from "./player-provider";
import { Slider } from "./slider";
import { useFullscreen } from "./use-fullscreen";
import { YouTubeEngine } from "./youtube-engine";
import { readPlayerMinimized, writePlayerMinimized } from "@/lib/ui-storage";

export function PlayerBar({ playlistId }: { playlistId: string }) {
  const {
    current,
    currentTime,
    duration,
    isPlaying,
    isReady,
    volume,
    muted,
    tracks,
    queueOpen,
    queueDocked,
    toggle,
    prev,
    next,
    seek,
    setVolume,
    toggleMute,
    setQueueOpen,
  } = usePlayer();
  const { active: fullscreen, toggleFullscreen } = useFullscreen();
  const [minimized, setMinimizedState] = useState(false);

  useEffect(() => {
    setMinimizedState(readPlayerMinimized());
  }, []);

  function setMinimized(value: boolean) {
    setMinimizedState(value);
    writePlayerMinimized(value);
  }

  const queueActive = queueOpen || queueDocked;
  const thumb = current?.thumbnail || (current ? thumbnailUrl(current.videoId, "mq") : null);

  return (
    <>
      <div aria-hidden style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <YouTubeEngine playlistId={playlistId} />
      </div>

      {minimized ? (
        <div className="player-card player-card--minimized">
          <div className="player-card__mini-thumb">
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt=""
                onError={(e) => {
                  if (current) e.currentTarget.src = thumbnailUrl(current.videoId);
                }}
              />
            ) : (
              <div className="player-card__thumb-placeholder" />
            )}
          </div>

          <p className="player-card__mini-title">
            {current?.displayTitle ?? "একটা গান বেছে নিন"}
          </p>

          <div className="player-card__transport">
            <button type="button" onClick={prev} disabled={!isReady} className="player-card__skip-btn" aria-label="আগের গান">
              <SkipBack />
            </button>
            <button type="button" onClick={toggle} disabled={!isReady} className="player-card__play-btn" aria-label={isPlaying ? "বিরতি" : "চালান"}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button type="button" onClick={next} disabled={!isReady} className="player-card__skip-btn" aria-label="পরের গান">
              <SkipForward />
            </button>
          </div>

          <span className="player-card__time">{formatTime(currentTime)}</span>
          <Slider
            value={currentTime}
            max={duration || 1}
            onChange={seek}
            ariaLabel="গানের অবস্থান"
            className="player-card__progress-slider"
          />
          <span className="player-card__time player-card__time--right">{formatTime(duration)}</span>

          <div className="player-card__mini-vol">
            <button type="button" onClick={toggleMute} className="player-card__icon-btn" aria-label={muted ? "আনমিউট" : "মিউট"}>
              {muted || volume === 0 ? <VolumeX /> : <Volume2 />}
            </button>
            <Slider
              value={muted ? 0 : volume}
              max={100}
              onChange={setVolume}
              ariaLabel="ভলিউম"
              className="player-card__mini-vol-slider"
            />
          </div>

          <div className="player-card__controls-right">
            <button
              type="button"
              onClick={() => setQueueOpen(!queueActive)}
              className={`player-card__queue-btn${queueActive ? " player-card__queue-btn--active" : ""}`}
              aria-pressed={queueActive}
              aria-label="গানের তালিকা"
            >
              <ListMusic />
              {tracks.length > 0 && (
                <span className="player-card__queue-count">{tracks.length}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMinimized(false)}
              className="player-card__icon-btn"
              aria-label="Player প্রসারিত করুন"
              title="Expand player"
            >
              <ChevronUp />
            </button>
          </div>
        </div>
      ) : (
        <div className="player-card">
          <div className="player-card__artwork-wrap">
            <div className={`player-card__ring${isPlaying ? " player-card__ring--spinning" : ""}`} />
            <div className="player-card__thumb">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt=""
                  onError={(e) => {
                    if (current) e.currentTarget.src = thumbnailUrl(current.videoId);
                  }}
                />
              ) : (
                <div className="player-card__thumb-placeholder" />
              )}
            </div>
          </div>

          <div className="player-card__info-wrap">
            <div className="player-card__name-controls-wrap">
              <div className="player-card__info">
                <p className="player-card__track-title">
                  {current?.displayTitle ?? "একটা গান বেছে নিন"}
                </p>
                <p className="player-card__track-author">
                  {current?.author ? `${current.author}` : ""}{current?.channelTitle ? ` · ${current.channelTitle}` : ""}
                </p>
              </div>

              <div className="player-card__controls">
                <div className="player-card__controls-left">
                  <button type="button" onClick={toggleMute} className="player-card__icon-btn" aria-label={muted ? "আনমিউট" : "মিউট"}>
                    {muted || volume === 0 ? <VolumeX /> : <Volume2 />}
                  </button>
                  <div className="player-card__volume-slider">
                    <Slider value={muted ? 0 : volume} max={100} onChange={setVolume} ariaLabel="ভলিউম" />
                  </div>
                </div>

                <div className="player-card__transport">
                  <button type="button" onClick={prev} disabled={!isReady} className="player-card__skip-btn" aria-label="আগের গান">
                    <SkipBack />
                  </button>
                  <button type="button" onClick={toggle} disabled={!isReady} className="player-card__play-btn" aria-label={isPlaying ? "বিরতি" : "চালান"}>
                    {isPlaying ? <Pause /> : <Play />}
                  </button>
                  <button type="button" onClick={next} disabled={!isReady} className="player-card__skip-btn" aria-label="পরের গান">
                    <SkipForward />
                  </button>
                </div>

                <div className="player-card__controls-right">
                  <button
                    type="button"
                    onClick={() => setQueueOpen(!queueActive)}
                    className={`player-card__queue-btn${queueActive ? " player-card__queue-btn--active" : ""}`}
                    aria-pressed={queueActive}
                    aria-label="গানের তালিকা"
                  >
                    <ListMusic />
                    {tracks.length > 0 && (
                      <span className="player-card__queue-count">{tracks.length}</span>
                    )}
                  </button>
                  <button type="button" onClick={toggleFullscreen} className="player-card__icon-btn" aria-label={fullscreen ? "ফুলস্ক্রিন বন্ধ" : "ফুলস্ক্রিন"}>
                    {fullscreen ? <Minimize /> : <Maximize />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinimized(true)}
                    className="player-card__icon-btn"
                    aria-label="Player ছোট করুন"
                    title="Minimize player"
                  >
                    <ChevronDown />
                  </button>
                </div>
              </div>
            </div>

            <div className="player-card__progress-row">
              <span className="player-card__time">{formatTime(currentTime)}</span>
              <Slider
                value={currentTime}
                max={duration || 1}
                onChange={seek}
                ariaLabel="গানের অবস্থান"
                className="player-card__progress-slider"
              />
              <span className="player-card__time player-card__time--right">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
