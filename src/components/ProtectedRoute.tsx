import { Navigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import type { ReactElement } from 'react';

interface ProtectedRouteProps {
  children: ReactElement;
  requirePersonalInfo?: boolean;
  requireWorkExperience?: boolean;
  requireQuestionnaire?: boolean;
}

export const ProtectedRoute = ({
  children,
  requirePersonalInfo = false,
  requireWorkExperience = false,
  requireQuestionnaire = false,
}: ProtectedRouteProps) => {
  const { data } = useApplication();

  // Check if personal info is completed (required fields filled)
  const isPersonalInfoComplete = () => {
    const { fullName, email, phone, city, country } = data.personalInfo;
    return fullName && email && phone && city && country;
  };

  // Check if work experience is valid (no validation required for empty, but if filled must be valid)
  const isWorkExperienceValid = () => {
    // Work experience is optional, so we consider it valid if empty
    if (data.workExperience.length === 0) return true;
    
    // If there are experiences, check that they have required fields
    return data.workExperience.every(exp => 
      exp.company && 
      exp.role && 
      exp.startDate && 
      exp.description &&
      (exp.isCurrentRole || exp.endDate)
    );
  };

  // Check if questionnaire is completed
  const isQuestionnaireComplete = () => {
    const { legalAuthorization, availableIn30Days, relocationSupport, cvFile } = data.questionnaire;
    return legalAuthorization && availableIn30Days && relocationSupport && cvFile;
  };

  // Check requirements based on route
  if (requirePersonalInfo && !isPersonalInfoComplete()) {
    return <Navigate to="/" replace />;
  }

  if (requireWorkExperience && (!isPersonalInfoComplete() || !isWorkExperienceValid())) {
    return <Navigate to="/" replace />;
  }

  if (requireQuestionnaire && (!isPersonalInfoComplete() || !isWorkExperienceValid() || !isQuestionnaireComplete())) {
    return <Navigate to="/" replace />;
  }

  return children;
};
