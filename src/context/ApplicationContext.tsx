import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ApplicationData, PersonalInfo, WorkExperience, Questionnaire } from '../types';

interface ApplicationContextType {
    data: ApplicationData;
    updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
    updateWorkExperience: (experiences: WorkExperience[]) => void;
    updateQuestionnaire: (data: Partial<Questionnaire>) => void;
    resetApplication: () => void;
}

const APPLICATION_DATA_KEY = 'application-wizard-data';

const defaultData: ApplicationData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        linkedinUrl: '',
        gitUrl: ''
    },
    workExperience: [],
    questionnaire: {
        legalAuthorization: '' as 'yes' | 'no',
        availableIn30Days: '' as 'yes' | 'no',
        relocationSupport: '' as 'yes' | 'no',
        cvFile: null
    }
};

// Load data from localStorage
const loadFromLocalStorage = (): ApplicationData => {
    try {
        const stored = localStorage.getItem(APPLICATION_DATA_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Note: File objects cannot be serialized, so cvFile will need to be re-uploaded
            // We store file metadata but the actual file is lost on refresh
            return parsed;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return defaultData;
};

// Save data to localStorage
const saveToLocalStorage = (data: ApplicationData) => {
    try {
        // Create a serializable version of the data
        const dataToStore = {
            ...data,
            questionnaire: {
                ...data.questionnaire,
                // Store file metadata if file exists, but not the actual File object
                cvFile: data.questionnaire.cvFile ? {
                    name: data.questionnaire.cvFile.name,
                    size: data.questionnaire.cvFile.size,
                    type: data.questionnaire.cvFile.type,
                    // Flag to indicate this is metadata, not actual file
                    _isMetadata: true
                } : null
            }
        };
        localStorage.setItem(APPLICATION_DATA_KEY, JSON.stringify(dataToStore));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<ApplicationData>(() => loadFromLocalStorage());

    // Save to localStorage whenever data changes
    useEffect(() => {
        saveToLocalStorage(data);
    }, [data]);

    const updatePersonalInfo = (newData: Partial<PersonalInfo>) => {
        setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...newData } }));
    };

    const updateWorkExperience = (experiences: WorkExperience[]) => {
        setData(prev => ({ ...prev, workExperience: experiences }));
    };

    const updateQuestionnaire = (newData: Partial<Questionnaire>) => {
        setData(prev => ({ ...prev, questionnaire: { ...prev.questionnaire, ...newData } }));
    };

    const resetApplication = () => {
        setData(defaultData);
        localStorage.removeItem(APPLICATION_DATA_KEY);
    };

    return (
        <ApplicationContext.Provider value={{ data, updatePersonalInfo, updateWorkExperience, updateQuestionnaire, resetApplication }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplication must be used within an ApplicationProvider');
    }
    return context;
};
