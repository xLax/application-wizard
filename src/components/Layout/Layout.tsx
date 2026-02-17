import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

const steps = [
    { id: 'personal-info', label: 'Personal Info', path: '/' },
    { id: 'work-experience', label: 'Experience', path: '/work-experience' },
    { id: 'questionnaire', label: 'Questionnaire', path: '/questionnaire' },
    { id: 'summary', label: 'Summary', path: '/summary' },
];

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resetApplication } = useApplication();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Normalize path for matching (handle trailing slash if needed, or exact match)
    const currentPath = location.pathname === '/thank-you' ? '/summary' : location.pathname; // Keep summary active or all completed? 
    // If thank you, maybe all completed.

    const currentStepIndex = location.pathname === '/thank-you'
        ? steps.length
        : steps.findIndex(step => step.path === currentPath);

    const handleNewApplication = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmNewApplication = () => {
        resetApplication();
        setShowConfirmDialog(false);
        navigate('/');
    };

    const handleCancelNewApplication = () => {
        setShowConfirmDialog(false);
    };

    // Don't show New Application button on thank you page
    const showNewApplicationButton = location.pathname !== '/thank-you';

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

                    {/* New Application Button */}
                    {showNewApplicationButton && (
                        <button
                            className="btn btn-primary new-app-btn"
                            onClick={handleNewApplication}
                        >
                            New Application
                        </button>
                    )}
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

            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Start New Application?"
                message="All entered information will be deleted. Are you sure you want to proceed?"
                onConfirm={handleConfirmNewApplication}
                onCancel={handleCancelNewApplication}
            />
        </div>
    );
};
