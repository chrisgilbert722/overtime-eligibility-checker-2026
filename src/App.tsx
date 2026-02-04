import { useState } from 'react';
import Header from './components/Header';
import InputCard from './components/InputCard';
import ResultsPanel from './components/ResultsPanel';
import BreakdownTable from './components/BreakdownTable';
import SEOText from './components/SEOText';
import AdContainer from './components/AdContainer';
import Footer from './components/Footer';
import { calculateOvertime, OvertimeInput } from './logic/eligibilityCalculations';

export default function App() {
    const [inputs, setInputs] = useState<OvertimeInput>({
        jobRole: 'retail',
        payType: 'hourly',
        weeklyEarnings: 800,
        state: 'TX',
        dutiesTest: 'unsure',
    });
    const result = calculateOvertime(inputs);
    return (
        <div className="container">
            <Header />
            <AdContainer slot="top-banner" format="horizontal" />
            <ResultsPanel result={result} />
            <InputCard inputs={inputs} setInputs={setInputs} />
            <BreakdownTable result={result} />
            <AdContainer slot="mid-content" format="rectangle" />
            <SEOText />
            <Footer />
            <AdContainer slot="sticky-footer" format="horizontal" sticky />
        </div>
    );
}
