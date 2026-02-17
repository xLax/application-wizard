import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Step1_PersonalInfo } from './components/Steps/Step1_PersonalInfo';
import { Step2_WorkExperience } from './components/Steps/Step2_WorkExperience';
import { Step3_Questionnaire } from './components/Steps/Step3_Questionnaire';
import { Step4_Summary } from './components/Steps/Step4_Summary';
import { Step5_ThankYou } from './components/Steps/Step5_ThankYou';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Step1_PersonalInfo />} />
        <Route 
          path="/work-experience" 
          element={
            <ProtectedRoute requirePersonalInfo>
              <Step2_WorkExperience />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/questionnaire" 
          element={
            <ProtectedRoute requirePersonalInfo requireWorkExperience>
              <Step3_Questionnaire />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/summary" 
          element={
            <ProtectedRoute requirePersonalInfo requireWorkExperience requireQuestionnaire>
              <Step4_Summary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/thank-you" 
          element={
            <ProtectedRoute requirePersonalInfo requireWorkExperience requireQuestionnaire>
              <Step5_ThankYou />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
