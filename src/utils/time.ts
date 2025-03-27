export function timeToSecondFormater(time: string) {
  if (time) {
    if (time.includes(':')) {
      if (time.includes('_')) {
        const newTime = time?.replaceAll('_', '0');
        time = newTime;
      }

      const [min, sec] = time.split(':');
      return Number(min) * 60 + Number(sec);
    } else {
      return Number(time) * 60;
    }
  } else {
    return 0;
  }
}

export function secondToTimeFormater(sec: number | string) {
  const min = Math.floor((Number(sec) % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(Number(sec) % 60)
    .toString()
    .padStart(2, '0');

  return min + ':' + seconds;
}
