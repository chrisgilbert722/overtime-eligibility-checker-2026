import React from 'react';
import type { EligibilityInput } from '../logic/eligibilityCalculations';

interface ScenarioControlsProps {
    values: EligibilityInput;
    onChange: (field: keyof EligibilityInput, value: string | number) => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({ values, onChange }) => {
    const hoursOptions = [
        { label: '40 hrs', value: 40 },
        { label: '45 hrs', value: 45 },
        { label: '50 hrs', value: 50 },
        { label: '55 hrs', value: 55 },
    ];

    const exemptOptions = [
        { label: 'Unsure', value: 'unsure' },
        { label: 'Non-Exempt', value: 'no' },
        { label: 'Exempt', value: 'yes' },
    ];

    return (
        <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Adjustments</h3>

            {/* Hours Quick Select */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ marginBottom: 'var(--space-2)' }}>Weekly Hours</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {hoursOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange('weeklyHours', option.value)}
                            style={{
                                flex: 1,
                                padding: 'var(--space-2) var(--space-3)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                border: '1px solid',
                                borderColor: values.weeklyHours === option.value ? 'var(--color-primary)' : 'var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                background: values.weeklyHours === option.value ? 'var(--color-primary)' : 'transparent',
                                color: values.weeklyHours === option.value ? '#fff' : 'var(--color-text-primary)',
                                cursor: 'pointer'
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exempt Status Quick Select */}
            <div>
                <label style={{ marginBottom: 'var(--space-2)' }}>Exempt Status</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {exemptOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange('exemptStatus', option.value)}
                            style={{
                                flex: 1,
                                padding: 'var(--space-2) var(--space-3)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                border: '1px solid',
                                borderColor: values.exemptStatus === option.value ? 'var(--color-primary)' : 'var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                background: values.exemptStatus === option.value ? 'var(--color-primary)' : 'transparent',
                                color: values.exemptStatus === option.value ? '#fff' : 'var(--color-text-primary)',
                                cursor: 'pointer'
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
