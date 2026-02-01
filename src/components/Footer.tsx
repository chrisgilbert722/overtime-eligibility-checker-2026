import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <nav style={{ marginBottom: 'var(--space-3)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                <span style={{ color: '#64748B' }}>|</span>
                <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
            </nav>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                © 2026 Personal Loan Calculator. For informational purposes only.
            </p>
        </footer>
    );
};
