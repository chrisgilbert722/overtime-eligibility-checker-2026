import React from 'react';

export const SEOText: React.FC = () => {
    return (
        <div className="card" style={{ background: '#F8FAFC' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                This overtime eligibility checker provides a simplified estimate based on basic employment
                factors such as pay type, salary level, and exempt status. These results are estimates only
                and do not constitute legal advice. Actual overtime eligibility is determined by federal
                and state laws, your specific job duties, and how your employer classifies your position.
                For accurate guidance, consult an employment attorney or your state labor department.
            </p>
        </div>
    );
};
