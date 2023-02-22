export const HOURS = 3600000;

export function durationToHours(duration: number) {
  return (Math.round((duration * 4) / HOURS) / 4).toFixed(2);
}
