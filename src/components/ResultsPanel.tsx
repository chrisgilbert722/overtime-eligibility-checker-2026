import React from 'react';
import type { EligibilityOutput } from '../logic/eligibilityCalculations';

interface ResultsPanelProps {
    result: EligibilityOutput;
}

const getResultStyle = (result: EligibilityOutput['result']) => {
    switch (result) {
        case 'likely_eligible':
            return {
                background: 'linear-gradient(to bottom, #F0FDF4, #DCFCE7)',
                borderColor: '#86EFAC',
                color: '#166534',
                shadow: '0 2px 8px -2px rgba(34, 197, 94, 0.15)'
            };
        case 'possibly_eligible':
            return {
                background: 'linear-gradient(to bottom, #FEF3C7, #FDE68A)',
                borderColor: '#FCD34D',
                color: '#92400E',
                shadow: '0 2px 8px -2px rgba(245, 158, 11, 0.15)'
            };
        case 'likely_exempt':
            return {
                background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
                borderColor: '#CBD5E1',
                color: '#475569',
                shadow: '0 2px 8px -2px rgba(100, 116, 139, 0.15)'
            };
    }
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
    const style = getResultStyle(result.result);

    return (
        <div className="card" style={{ background: style.background, borderColor: style.borderColor, boxShadow: style.shadow }}>
            <div className="text-center">
                <h2 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estimated Eligibility Result
                </h2>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: style.color, lineHeight: 1.2, letterSpacing: '-0.025em' }}>
                    {result.resultLabel}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)', fontStyle: 'italic' }}>
                    Eligibility estimate only — not legal advice
                </div>
            </div>

            <hr style={{ margin: 'var(--space-5) 0', border: 'none', borderTop: `1px solid ${style.borderColor}` }} />

            <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, textAlign: 'center' }}>
                {result.summary}
            </div>

            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(0,0,0,0.03)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Actual eligibility depends on full circumstances. Consult an employment attorney or your state labor department for specific guidance.
                </span>
            </div>
        </div>
    );
};
