import React from 'react';
import type { EligibilityInput } from '../logic/eligibilityCalculations';
import { JOB_TYPE_OPTIONS, US_STATES } from '../logic/eligibilityCalculations';

interface InputCardProps {
    values: EligibilityInput;
    onChange: (field: keyof EligibilityInput, value: string | number) => void;
}

export const InputCard: React.FC<InputCardProps> = ({ values, onChange }) => {
    return (
        <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Job Type */}
                <div>
                    <label htmlFor="jobType">Job Type</label>
                    <select
                        id="jobType"
                        value={values.jobType}
                        onChange={(e) => onChange('jobType', e.target.value)}
                    >
                        {JOB_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Pay Type */}
                <div>
                    <label htmlFor="payType">Pay Type</label>
                    <select
                        id="payType"
                        value={values.payType}
                        onChange={(e) => onChange('payType', e.target.value)}
                    >
                        <option value="hourly">Hourly</option>
                        <option value="salary">Salary</option>
                    </select>
                </div>

                {/* Annual Salary (only shown for salaried) */}
                {values.payType === 'salary' && (
                    <div>
                        <label htmlFor="annualSalary">Annual Salary ($)</label>
                        <input
                            type="number"
                            id="annualSalary"
                            value={values.annualSalary}
                            onChange={(e) => onChange('annualSalary', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="1000"
                        />
                    </div>
                )}

                {/* Weekly Hours */}
                <div>
                    <label htmlFor="weeklyHours">Typical Weekly Hours Worked</label>
                    <input
                        type="number"
                        id="weeklyHours"
                        value={values.weeklyHours}
                        onChange={(e) => onChange('weeklyHours', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="168"
                        step="1"
                    />
                </div>

                {/* State */}
                <div>
                    <label htmlFor="state">State</label>
                    <select
                        id="state"
                        value={values.state}
                        onChange={(e) => onChange('state', e.target.value)}
                    >
                        {US_STATES.map((st) => (
                            <option key={st.value} value={st.value}>{st.label}</option>
                        ))}
                    </select>
                </div>

                {/* Exempt Status */}
                <div>
                    <label htmlFor="exemptStatus">Are you classified as exempt?</label>
                    <select
                        id="exemptStatus"
                        value={values.exemptStatus}
                        onChange={(e) => onChange('exemptStatus', e.target.value)}
                    >
                        <option value="unsure">Unsure / Don't Know</option>
                        <option value="no">No - Non-Exempt</option>
                        <option value="yes">Yes - Exempt</option>
                    </select>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Exempt status is typically listed on your employment agreement or job offer
                    </span>
                </div>
            </div>
        </div>
    );
};
