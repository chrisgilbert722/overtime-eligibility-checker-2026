import { OvertimeResult } from '../logic/eligibilityCalculations';

interface BreakdownTableProps { result: OvertimeResult; }

export default function BreakdownTable({ result }: BreakdownTableProps) {
    return (
        <div className="card">
            <h3 style={{ margin: '0 0 1rem' }}>Eligibility Factors & State Notes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Factor</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {result.factors.map((row, i) => (
                        <tr key={i}>
                            <td>{row.factor}</td>
                            <td>{row.valueLow}</td>
                        </tr>
                    ))}
                    <tr>
                        <td>State Rule Notes</td>
                        <td>{result.stateNotes}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
