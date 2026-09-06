export function extractYouTubeId(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];


  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];


  return null;
}