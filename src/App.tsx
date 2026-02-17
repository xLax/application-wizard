import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Step1_PersonalInfo } from './components/Steps/Step1_PersonalInfo';
import { Step2_WorkExperience } from './components/Steps/Step2_WorkExperience';
import { Step3_Questionnaire } from './components/Steps/Step3_Questionnaire';
import { Step4_Summary } from './components/Steps/Step4_Summary';
import { Step5_ThankYou } from './components/Steps/Step5_ThankYou';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Step1_PersonalInfo />} />
        <Route path="/work-experience" element={<Step2_WorkExperience />} />
        <Route path="/questionnaire" element={<Step3_Questionnaire />} />
        <Route path="/summary" element={<Step4_Summary />} />
        <Route path="/thank-you" element={<Step5_ThankYou />} />
      </Route>
    </Routes>
  );
}

export default App;
