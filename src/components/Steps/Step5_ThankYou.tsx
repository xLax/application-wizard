import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { PartyPopper } from 'lucide-react';
import styles from './Step5_ThankYou.module.css';

export const Step5_ThankYou = () => {
    const { resetApplication } = useApplication();
    const navigate = useNavigate();

    const handleApplyAgain = () => {
        resetApplication();
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <PartyPopper size={40} />
            </div>
            <h2 className={styles.title}>Application Submitted!</h2>
            <p className={styles.message}>
                Thank you for applying. We have received your application and will review it shortly.
            </p>

            <button className="btn btn-primary" onClick={handleApplyAgain}>
                Apply Again
            </button>
        </div>
    );
};
