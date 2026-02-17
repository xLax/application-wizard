import { Outlet, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const steps = [
    { id: 'personal-info', label: 'Personal Info', path: '/' },
    { id: 'work-experience', label: 'Experience', path: '/work-experience' },
    { id: 'questionnaire', label: 'Questionnaire', path: '/questionnaire' },
    { id: 'summary', label: 'Summary', path: '/summary' },
];

export const Layout = () => {
    const location = useLocation();

    // Normalize path for matching (handle trailing slash if needed, or exact match)
    const currentPath = location.pathname === '/thank-you' ? '/summary' : location.pathname; // Keep summary active or all completed? 
    // If thank you, maybe all completed.

    const currentStepIndex = location.pathname === '/thank-you'
        ? steps.length
        : steps.findIndex(step => step.path === currentPath);

    return (
        <div className="layout-container">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">Application Wizard</h1>

                    {/* Stepper */}
                    <div className="stepper">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.id} className="step-item">
                                    <div className={clsx(
                                        "step-circle",
                                        isCompleted && "completed",
                                        isCurrent && "current"
                                    )}>
                                        {isCompleted ? <Check size={16} /> : <span>{index + 1}</span>}
                                    </div>
                                    <span className={clsx(
                                        "step-label",
                                        isCurrent && "current"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="card">
                    <Outlet />
                </div>
            </main>

            <footer>
                {/* Footer content if needed */}
            </footer>
        </div>
    );
};
