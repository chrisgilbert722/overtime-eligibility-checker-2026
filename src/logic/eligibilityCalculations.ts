export interface OvertimeInput {
  jobRole: string;
  payType: string;
  weeklyEarnings: number;
  state: string;
  dutiesTest: string;
}

export interface OvertimeResult {
  eligibilityLow: number;
  eligibilityHigh: number;
  flsaExemptionIndicator: string;
  stateNotes: string;
  factors: { factor: string; valueLow: string; valueHigh: string }[];
}

const FEDERAL_SALARY_THRESHOLD = 58656;

const STATE_THRESHOLDS: Record<string, { threshold: number; note: string }> = {
  'CA': { threshold: 66560, note: 'California may require daily overtime after 8 hours and has a higher salary threshold' },
  'NY': { threshold: 62400, note: 'New York has higher salary thresholds for certain industries' },
  'WA': { threshold: 69500, note: 'Washington has tiered salary thresholds based on employer size' },
  'CO': { threshold: 57500, note: 'Colorado has specific overtime rules for certain job types' },
  'AK': { threshold: 58656, note: 'Alaska may require daily overtime after 8 hours' },
  'NV': { threshold: 58656, note: 'Nevada may require daily overtime after 8 hours depending on wage level' },
};

const ROLE_EXEMPTION_WEIGHT: Record<string, number> = {
  'executive': 25,
  'administrative': 20,
  'professional': 20,
  'computer': 15,
  'outside-sales': 30,
  'retail': -15,
  'manufacturing': -20,
  'food-service': -20,
  'healthcare-nonexempt': -15,
  'construction': -20,
  'other': 0,
};

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const annualizedEarnings = input.weeklyEarnings * 52;
  const stateInfo = STATE_THRESHOLDS[input.state];
  const effectiveThreshold = stateInfo ? Math.max(FEDERAL_SALARY_THRESHOLD, stateInfo.threshold) : FEDERAL_SALARY_THRESHOLD;

  let baseLow = 40;
  let baseHigh = 70;

  // Pay type adjustment
  if (input.payType === 'hourly') {
    baseLow += 25;
    baseHigh += 20;
  } else if (input.payType === 'salary' && annualizedEarnings < effectiveThreshold) {
    baseLow += 15;
    baseHigh += 15;
  } else if (input.payType === 'salary' && annualizedEarnings >= effectiveThreshold) {
    baseLow -= 20;
    baseHigh -= 15;
  }

  // Role adjustment
  const roleWeight = ROLE_EXEMPTION_WEIGHT[input.jobRole] ?? 0;
  baseLow -= roleWeight;
  baseHigh -= roleWeight;

  // Duties test adjustment
  if (input.dutiesTest === 'non-exempt') {
    baseLow += 15;
    baseHigh += 10;
  } else if (input.dutiesTest === 'exempt') {
    baseLow -= 20;
    baseHigh -= 15;
  }

  baseLow = Math.max(0, Math.min(100, baseLow));
  baseHigh = Math.max(0, Math.min(100, baseHigh));
  if (baseLow > baseHigh) baseLow = baseHigh;

  // FLSA exemption indicator
  let flsaExemptionIndicator: string;
  const avg = (baseLow + baseHigh) / 2;
  if (avg >= 60) flsaExemptionIndicator = 'Likely Non-Exempt (Eligible)';
  else if (avg >= 35) flsaExemptionIndicator = 'Uncertain — Review Duties';
  else flsaExemptionIndicator = 'Likely Exempt (Not Eligible)';

  const stateNotes = stateInfo ? stateInfo.note : 'This state generally follows federal FLSA overtime rules';

  const factors: OvertimeResult['factors'] = [
    { factor: 'Pay Type', valueLow: input.payType, valueHigh: input.payType },
    { factor: 'Annualized Earnings', valueLow: fmt(annualizedEarnings), valueHigh: fmt(annualizedEarnings) },
    { factor: 'Federal Threshold (2026)', valueLow: fmt(FEDERAL_SALARY_THRESHOLD), valueHigh: fmt(FEDERAL_SALARY_THRESHOLD) },
    { factor: 'Effective Threshold', valueLow: fmt(effectiveThreshold), valueHigh: fmt(effectiveThreshold) },
    { factor: 'Below Threshold?', valueLow: annualizedEarnings < effectiveThreshold ? 'Yes' : 'No', valueHigh: annualizedEarnings < effectiveThreshold ? 'Yes' : 'No' },
    { factor: 'FLSA Indicator', valueLow: flsaExemptionIndicator, valueHigh: flsaExemptionIndicator },
  ];

  return { eligibilityLow: baseLow, eligibilityHigh: baseHigh, flsaExemptionIndicator, stateNotes, factors };
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
