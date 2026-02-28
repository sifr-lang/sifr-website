const CHARS_PER_MINUTE = 2200;
const LINES_PER_MINUTE = 180;

export const estimateReadingMinutes = (content: string): number => {
  const readableContent = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();

  if (!readableContent) {
    return 1;
  }

  const characterCount = readableContent.replace(/\s+/g, '').length;
  const nonEmptyLineCount = readableContent
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0).length;

  const estimatedMinutes =
    characterCount / CHARS_PER_MINUTE + nonEmptyLineCount / LINES_PER_MINUTE;

  return Math.max(1, Math.round(estimatedMinutes));
};
