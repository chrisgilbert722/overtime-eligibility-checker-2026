import { OvertimeResult } from '../logic/eligibilityCalculations';

interface ResultsPanelProps { result: OvertimeResult; }

export default function ResultsPanel({ result }: ResultsPanelProps) {
    return (
        <div className="results-panel">
            <h2>Estimated Overtime Eligibility Likelihood</h2>
            <div className="hero-number">{result.eligibilityLow}% – {result.eligibilityHigh}%</div>
            <div className="hero-label">Eligibility estimate only — not legal advice</div>
            <div className="secondary-results">
                <div className="secondary-stat">
                    <div className="stat-value">{result.flsaExemptionIndicator}</div>
                    <div className="stat-label">FLSA Indicator</div>
                </div>
                <div className="secondary-stat">
                    <div className="stat-value">{result.eligibilityLow}%</div>
                    <div className="stat-label">Low Estimate</div>
                </div>
                <div className="secondary-stat">
                    <div className="stat-value">{result.eligibilityHigh}%</div>
                    <div className="stat-label">High Estimate</div>
                </div>
            </div>
        </div>
    );
}
