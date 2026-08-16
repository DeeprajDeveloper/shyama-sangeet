export const DEFAULT_PLAYLIST_ID = "PLTJW3mgaO5zo";

export const SITE_NAME = "Shyama Sangeet";
export const SITE_NAME_BN = "শ্যামা সংগীত";
export const SITE_TAGLINE_BN = "মায়ের গানে • মনের শান্তি";
export const SITE_DESCRIPTION =
  `${SITE_TAGLINE_BN} — a Bengali devotional music player for Shyama Sangeet, soul-stirring songs dedicated to Goddess Kali.`;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://shyama-sangeet.vercel.app";

export function playlistId() {
  return (
    process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID ??
    process.env.YOUTUBE_PLAYLIST_ID ??
    DEFAULT_PLAYLIST_ID
  );
}

export function thumbnailUrl(videoId: string, quality: "hq" | "sd" | "mq" | "max" = "hq") {
  const file =
    quality === "max"
      ? "maxresdefault.jpg"
      : quality === "sd"
        ? "sddefault.jpg"
        : quality === "mq"
          ? "mqdefault.jpg"
          : "hqdefault.jpg";
  return `https://i.ytimg.com/vi/${videoId}/${file}`;
}

export type KaliPujaDate = {
  /** English calendar date, e.g. "November 08, 2026" */
  en: string;
  /** Optional Bengali calendar date, e.g. "২২ কার্তিক, ১৪৩৩" */
  bn?: string;
};

export const KALI_PUJA_DATES: KaliPujaDate[] = [
  { en: "November 08, 2026", bn: "২২ কার্তিক, ১৪৩৩" },
  { en: "October 29, 2027", bn: "১১ কার্তিক, ১৪৩৪" },
  { en: "October 17, 2028", bn: "৩০ আশ্বিন, ১৪৩৫" },
];