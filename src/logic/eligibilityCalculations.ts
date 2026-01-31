export type JobType =
    | 'office'
    | 'retail'
    | 'healthcare'
    | 'manufacturing'
    | 'tech'
    | 'construction'
    | 'food_service'
    | 'transportation'
    | 'other';

export type PayType = 'salary' | 'hourly';

export type ExemptStatus = 'yes' | 'no' | 'unsure';

export type EligibilityResult = 'likely_eligible' | 'possibly_eligible' | 'likely_exempt';

export interface EligibilityInput {
    jobType: JobType;
    payType: PayType;
    weeklyHours: number;
    state: string;
    exemptStatus: ExemptStatus;
    annualSalary: number;
}

export interface EligibilityFactor {
    factor: string;
    status: 'favorable' | 'unfavorable' | 'neutral';
    explanation: string;
}

export interface EligibilityOutput {
    result: EligibilityResult;
    resultLabel: string;
    summary: string;
    factors: EligibilityFactor[];
    federalThreshold: number;
    stateThreshold: number | null;
    stateHasSpecialRules: boolean;
    hoursOverThreshold: number;
}

// 2026 Federal salary threshold (projected based on DOL rules)
const FEDERAL_SALARY_THRESHOLD_2026 = 58656; // $1,128/week × 52

// States with higher salary thresholds or special OT rules
const STATE_THRESHOLDS: Record<string, { threshold: number; specialRules: string }> = {
    'CA': { threshold: 66560, specialRules: 'California has daily overtime after 8 hours' },
    'NY': { threshold: 62400, specialRules: 'New York has higher threshold for certain industries' },
    'WA': { threshold: 69500, specialRules: 'Washington has tiered thresholds based on employer size' },
    'CO': { threshold: 57500, specialRules: 'Colorado requires overtime for certain job types' },
    'AK': { threshold: 58656, specialRules: 'Alaska has daily overtime after 8 hours' },
    'NV': { threshold: 58656, specialRules: 'Nevada has daily overtime after 8 hours if wage below threshold' },
};

export function calculateEligibility(input: EligibilityInput): EligibilityOutput {
    const factors: EligibilityFactor[] = [];
    let eligibilityScore = 0; // Higher = more likely eligible

    const federalThreshold = FEDERAL_SALARY_THRESHOLD_2026;
    const stateInfo = STATE_THRESHOLDS[input.state];
    const stateThreshold = stateInfo?.threshold || null;
    const effectiveThreshold = stateThreshold ? Math.max(federalThreshold, stateThreshold) : federalThreshold;

    // Factor 1: Pay Type
    if (input.payType === 'hourly') {
        eligibilityScore += 3;
        factors.push({
            factor: 'Pay Type',
            status: 'favorable',
            explanation: 'Hourly workers are generally eligible for overtime pay'
        });
    } else {
        factors.push({
            factor: 'Pay Type',
            status: 'neutral',
            explanation: 'Salaried workers may be eligible depending on salary level and duties'
        });
    }

    // Factor 2: Exempt Status
    if (input.exemptStatus === 'no') {
        eligibilityScore += 3;
        factors.push({
            factor: 'Exempt Status',
            status: 'favorable',
            explanation: 'Non-exempt workers are entitled to overtime pay'
        });
    } else if (input.exemptStatus === 'yes') {
        eligibilityScore -= 3;
        factors.push({
            factor: 'Exempt Status',
            status: 'unfavorable',
            explanation: 'Exempt workers are generally not entitled to overtime pay'
        });
    } else {
        factors.push({
            factor: 'Exempt Status',
            status: 'neutral',
            explanation: 'Exempt status depends on salary level and job duties'
        });
    }

    // Factor 3: Salary Level (for salaried workers)
    if (input.payType === 'salary') {
        if (input.annualSalary < effectiveThreshold) {
            eligibilityScore += 2;
            factors.push({
                factor: 'Salary Level',
                status: 'favorable',
                explanation: `Salary below ${formatCurrency(effectiveThreshold)} threshold may qualify for overtime`
            });
        } else {
            eligibilityScore -= 1;
            factors.push({
                factor: 'Salary Level',
                status: 'unfavorable',
                explanation: `Salary above ${formatCurrency(effectiveThreshold)} threshold may indicate exempt status`
            });
        }
    }

    // Factor 4: Hours Worked
    const hoursOverThreshold = Math.max(0, input.weeklyHours - 40);
    if (input.weeklyHours > 40) {
        factors.push({
            factor: 'Hours Worked',
            status: 'neutral',
            explanation: `Working ${hoursOverThreshold} hours over the 40-hour threshold`
        });
    } else {
        factors.push({
            factor: 'Hours Worked',
            status: 'neutral',
            explanation: 'Working 40 hours or less per week (no overtime hours)'
        });
    }

    // Factor 5: State Rules
    if (stateInfo) {
        factors.push({
            factor: 'State Rules',
            status: 'neutral',
            explanation: stateInfo.specialRules
        });
    } else {
        factors.push({
            factor: 'State Rules',
            status: 'neutral',
            explanation: 'State follows federal overtime rules'
        });
    }

    // Determine result
    let result: EligibilityResult;
    let resultLabel: string;
    let summary: string;

    if (input.exemptStatus === 'yes' && input.payType === 'salary' && input.annualSalary >= effectiveThreshold) {
        result = 'likely_exempt';
        resultLabel = 'Likely Exempt';
        summary = 'Based on the information provided, you may be classified as exempt from overtime pay. Exempt status typically applies to salaried employees above the salary threshold who perform executive, administrative, or professional duties.';
    } else if (input.payType === 'hourly' || input.exemptStatus === 'no' || (input.payType === 'salary' && input.annualSalary < effectiveThreshold)) {
        result = 'likely_eligible';
        resultLabel = 'Likely Eligible';
        summary = 'Based on the information provided, you may be eligible for overtime pay. Hourly workers and salaried workers below the salary threshold are generally entitled to overtime for hours worked over 40 per week.';
    } else {
        result = 'possibly_eligible';
        resultLabel = 'Possibly Eligible';
        summary = 'Based on the information provided, your eligibility is uncertain. Actual overtime eligibility depends on your specific job duties, how your employer classifies your position, and applicable federal and state laws.';
    }

    return {
        result,
        resultLabel,
        summary,
        factors,
        federalThreshold,
        stateThreshold,
        stateHasSpecialRules: !!stateInfo,
        hoursOverThreshold
    };
}

function formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);
}

export const JOB_TYPE_OPTIONS: Array<{ value: JobType; label: string }> = [
    { value: 'office', label: 'Office / Administrative' },
    { value: 'retail', label: 'Retail / Sales' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'manufacturing', label: 'Manufacturing / Warehouse' },
    { value: 'tech', label: 'Technology / IT' },
    { value: 'construction', label: 'Construction / Trades' },
    { value: 'food_service', label: 'Food Service / Hospitality' },
    { value: 'transportation', label: 'Transportation / Logistics' },
    { value: 'other', label: 'Other' },
];

export const US_STATES: Array<{ value: string; label: string }> = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' },
];
