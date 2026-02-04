import { OvertimeInput } from '../logic/eligibilityCalculations';

interface InputCardProps {
    inputs: OvertimeInput;
    setInputs: React.Dispatch<React.SetStateAction<OvertimeInput>>;
}

export default function InputCard({ inputs, setInputs }: InputCardProps) {
    return (
        <div className="card">
            <div className="input-grid">
                <div className="input-group">
                    <label>Job Role Category</label>
                    <select value={inputs.jobRole} onChange={e => setInputs(prev => ({ ...prev, jobRole: e.target.value }))}>
                        <option value="retail">Retail / Sales</option>
                        <option value="manufacturing">Manufacturing / Warehouse</option>
                        <option value="food-service">Food Service / Hospitality</option>
                        <option value="construction">Construction / Trades</option>
                        <option value="healthcare-nonexempt">Healthcare (Non-Exempt Roles)</option>
                        <option value="administrative">Administrative / Office</option>
                        <option value="professional">Professional (Licensed)</option>
                        <option value="computer">Computer / IT Professional</option>
                        <option value="executive">Executive / Management</option>
                        <option value="outside-sales">Outside Sales</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Salary vs Hourly</label>
                    <select value={inputs.payType} onChange={e => setInputs(prev => ({ ...prev, payType: e.target.value }))}>
                        <option value="hourly">Hourly</option>
                        <option value="salary">Salary</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Weekly Earnings ($)</label>
                    <input type="number" min="0" step="50" value={inputs.weeklyEarnings} onChange={e => setInputs(prev => ({ ...prev, weeklyEarnings: Number(e.target.value) }))} />
                </div>
                <div className="input-group">
                    <label>State of Employment</label>
                    <select value={inputs.state} onChange={e => setInputs(prev => ({ ...prev, state: e.target.value }))}>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="OH">Ohio</option>
                        <option value="GA">Georgia</option>
                        <option value="WA">Washington</option>
                        <option value="CO">Colorado</option>
                        <option value="AK">Alaska</option>
                        <option value="NV">Nevada</option>
                        <option value="OTHER">Other State</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Duties Test Indicator</label>
                    <select value={inputs.dutiesTest} onChange={e => setInputs(prev => ({ ...prev, dutiesTest: e.target.value }))}>
                        <option value="unsure">Unsure / Not Sure</option>
                        <option value="non-exempt">Non-Exempt Duties</option>
                        <option value="exempt">Exempt Duties (Managerial/Professional)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
