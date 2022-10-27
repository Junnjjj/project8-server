export const leftTime = (endTime: string) => {
  const end = new Date(endTime);
  const start = new Date();
  const result = Math.abs(Number(end) - Number(start)) / (1000 * 60 * 24 * 2.5);

  // return new Intl.RelativeTimeFormat().format(end, start);
  return Math.floor(result);
};
