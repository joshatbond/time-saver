export const HOURS = 3600000;

export function durationToHours(duration: number) {
  return (duration / HOURS).toFixed(2);
}
