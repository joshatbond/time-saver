export const SECONDS = 1000;
export const MINUTES = SECONDS * 60;
export const HOURS = MINUTES * 60;
export const DAYS = HOURS * 24;

export function durationToHours(duration: number) {
  return (Math.round((duration * 4) / HOURS) / 4).toFixed(2);
}

export function timeBetweenDates(startTime: number, duration: number) {
  const difference = Date.now() - startTime + duration;

  return `
    ${String(Math.floor(difference / HOURS) % 24).padStart(2, "0")}:
    ${String(Math.floor(difference / MINUTES) % 60).padStart(2, "0")}:
    ${String(Math.floor(difference / SECONDS) % 60).padStart(2, "0")}`;
}
