export function Sparkline({
  values,
  stroke = "#0284c7",
  fill = "rgba(2,132,199,0.12)"
}: {
  values: number[];
  stroke?: string;
  fill?: string;
}) {
  const w = 240;
  const h = 70;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-9, max - min);
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return { x, y };
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={area} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

