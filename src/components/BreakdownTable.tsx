import React from 'react';
import type { EligibilityOutput, EligibilityFactor } from '../logic/eligibilityCalculations';

interface BreakdownTableProps {
    result: EligibilityOutput;
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);
};

const getStatusColor = (status: EligibilityFactor['status']) => {
    switch (status) {
        case 'favorable': return '#166534';
        case 'unfavorable': return '#991B1B';
        case 'neutral': return 'var(--color-text-secondary)';
    }
};

const getStatusLabel = (status: EligibilityFactor['status']) => {
    switch (status) {
        case 'favorable': return 'Favorable';
        case 'unfavorable': return 'Unfavorable';
        case 'neutral': return 'Neutral';
    }
};

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ result }) => {
    const thresholdRows = [
        { label: '2026 Federal Salary Threshold', value: formatCurrency(result.federalThreshold), isTotal: false },
        ...(result.stateThreshold ? [{ label: 'State Salary Threshold', value: formatCurrency(result.stateThreshold), isTotal: false }] : []),
        { label: 'Standard Weekly Hours Threshold', value: '40 hours', isTotal: false },
        { label: 'Your Hours Over Threshold', value: `${result.hoursOverThreshold} hours`, isTotal: result.hoursOverThreshold > 0 },
    ];

    const renderFactorsTable = () => (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <tbody>
                {result.factors.map((factor, idx) => (
                    <tr key={idx} style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC'
                    }}>
                        <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', width: '30%' }}>
                            <div style={{ fontWeight: 500 }}>{factor.factor}</div>
                            <div style={{ fontSize: '0.75rem', color: getStatusColor(factor.status), fontWeight: 600 }}>
                                {getStatusLabel(factor.status)}
                            </div>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                            {factor.explanation}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderThresholdTable = () => (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <tbody>
                {thresholdRows.map((row, idx) => (
                    <tr key={idx} style={{
                        borderBottom: idx === thresholdRows.length - 1 ? 'none' : '1px solid var(--color-border)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC'
                    }}>
                        <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>
                            {row.label}
                        </td>
                        <td style={{
                            padding: 'var(--space-3) var(--space-6)',
                            textAlign: 'right',
                            fontWeight: row.isTotal ? 700 : 400,
                            color: row.isTotal ? 'var(--color-primary)' : 'inherit'
                        }}>
                            {row.value}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="card" style={{ padding: '0' }}>
            {/* Eligibility Factors Section */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem' }}>Eligibility Factors Considered</h3>
            </div>
            {renderFactorsTable()}

            {/* Thresholds Section */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                <h3 style={{ fontSize: '1rem' }}>Overtime Thresholds (Simplified)</h3>
            </div>
            {renderThresholdTable()}

            {/* State Rules Indicator */}
            {result.stateHasSpecialRules && (
                <>
                    <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', background: '#FEF3C7' }}>
                        <h3 style={{ fontSize: '1rem', color: '#92400E' }}>State Rule Indicator</h3>
                    </div>
                    <div style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        Your state may have additional overtime rules beyond federal requirements. State-specific rules may include different salary thresholds or daily overtime provisions. Consult your state labor department for details.
                    </div>
                </>
            )}

            {/* Disclaimer */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', background: '#FEE2E2' }}>
                <p style={{ fontSize: '0.75rem', color: '#991B1B', margin: 0, lineHeight: 1.5 }}>
                    <strong>Important:</strong> This is an eligibility estimate only and does not constitute legal advice. Actual overtime eligibility depends on your specific job duties, employer classification, and applicable laws. Consult an employment attorney or your state labor department for guidance specific to your situation.
                </p>
            </div>
        </div>
    );
};
