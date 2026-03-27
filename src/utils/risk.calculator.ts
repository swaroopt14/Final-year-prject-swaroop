export type VitalsSnapshot = {
  heartRateBpm: number;
  systolicMmHg: number;
  diastolicMmHg: number;
  spo2Pct: number;
  temperatureC: number;
};

export function isHighRiskVitals(v: VitalsSnapshot) {
  return (
    v.spo2Pct < 92 ||
    v.systolicMmHg >= 180 ||
    v.diastolicMmHg >= 120 ||
    v.heartRateBpm >= 130 ||
    v.temperatureC >= 39.5
  );
}

