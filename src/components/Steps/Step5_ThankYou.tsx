import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { PartyPopper } from 'lucide-react';

export const Step5_ThankYou = () => {
    const { resetApplication } = useApplication();
    const navigate = useNavigate();

    const handleApplyAgain = () => {
        resetApplication();
        navigate('/');
    };

    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full text-green-600 mb-6">
                <PartyPopper size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Thank you for applying. We have received your application and will review it shortly.
            </p>

            <button className="btn btn-primary" onClick={handleApplyAgain}>
                Apply Again
            </button>
        </div>
    );
};
