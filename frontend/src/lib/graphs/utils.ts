export function getPieDataFromPercent(
  percent: number,
  labels: { 1: string; 2: string },
) {
  return [
    {
      id: labels[1],
      value: percent,
    },
    {
      id: labels[2],
      value: 100 - percent,
    },
  ];
}
