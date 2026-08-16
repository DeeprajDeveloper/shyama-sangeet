const BENGALI = /[\u0980-\u09FF]/;

const BRAND = /^(shyama\s*sangeet|শ্যামা\s*সংগীত|devotional|bengali\s*devotional|bhakti\s*geet|kirtan)$/i;

function isBrand(s: string) { return BRAND.test(s); }

export function parseSongTitle(raw: string) {
  const parts = raw
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);

  const meaningful = parts.filter((p) => !isBrand(p));

  const bengaliTitle = meaningful.find((p) => BENGALI.test(p));
  const nonBengaliParts = meaningful.filter((p) => !BENGALI.test(p));

  if (bengaliTitle) {
    const englishTitle = nonBengaliParts.length >= 2 ? nonBengaliParts[0] : undefined;
    const author =
      nonBengaliParts.length >= 2
        ? nonBengaliParts[nonBengaliParts.length - 1]
        : nonBengaliParts[0];
    return { displayTitle: bengaliTitle, englishTitle, author };
  }

  return {
    displayTitle: meaningful[0] ?? raw,
    englishTitle: undefined,
    author: meaningful.length >= 2 ? meaningful[meaningful.length - 1] : undefined,
  };
}
