import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { personalInfoSchema } from '../../schemas/validation';
import type { PersonalInfo } from '../../types';
import { FormField } from '../common/FormField';
import styles from './Step1_PersonalInfo.module.css';

export const Step1_PersonalInfo = () => {
    const { data, updatePersonalInfo } = useApplication();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<PersonalInfo>(data.personalInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNext = () => {
        const result = personalInfoSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                const path = err.path[0] as string;
                formattedErrors[path] = err.message;
            });
            setErrors(formattedErrors);
        } else {
            updatePersonalInfo(formData);
            navigate('/work-experience');
        }
    };

    return (
        <div>
            <h2 className="summary-title">Personal Information</h2>

            <FormField
                label="Full Name *"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="John Doe"
            />

            <div className={styles.gridContainer}>
                <FormField
                    label="Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="john@example.com"
                />

                <FormField
                    label="Phone *"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+1 234 567 890"
                />
            </div>

            <div className={styles.gridContainer}>
                <FormField
                    label="City *"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                />

                <FormField
                    label="Country *"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    error={errors.country}
                />
            </div>

            <FormField
                label="LinkedIn URL (Optional)"
                type="text"
                name="linkedinUrl"
                value={formData.linkedinUrl || ''}
                onChange={handleChange}
                error={errors.linkedinUrl}
                placeholder="https://linkedin.com/in/..."
            />

            <FormField
                label="GitHub URL (Optional)"
                type="text"
                name="gitUrl"
                value={formData.gitUrl || ''}
                onChange={handleChange}
                error={errors.gitUrl}
                placeholder="https://github.com/..."
            />

            <div className="actions-row">
                {Object.keys(errors).length > 0 && (
                    <div className={styles.errorMessage}>
                        Please fix the errors above.
                    </div>
                )}
                <button className="btn btn-primary" onClick={handleNext}>
                    Next Step
                </button>
            </div>
        </div>
    );
};
