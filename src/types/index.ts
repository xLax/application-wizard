export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    linkedinUrl?: string; // Optional field
    gitUrl?: string; // Optional field
}

export interface WorkExperience {
    id: string; // unique id for list management
    company: string;
    role: string;
    startDate: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
    description: string;
    isCurrentRole: boolean;
}

export interface Questionnaire {
    legalAuthorization: 'yes' | 'no' | '';
    availableIn30Days: 'yes' | 'no' | '';
    relocationSupport: 'yes' | 'no' | '';
    cvFile: File | null;
}

export interface ApplicationData {
    personalInfo: PersonalInfo;
    workExperience: WorkExperience[];
    questionnaire: Questionnaire;
}

export type StepId = 'personal-info' | 'work-experience' | 'questionnaire' | 'summary' | 'thank-you';
