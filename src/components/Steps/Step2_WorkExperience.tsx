import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { workExperienceItemSchema } from '../../schemas/validation';
import type { WorkExperience } from '../../types';
import { Trash2, Plus } from 'lucide-react';
import { FormField } from '../common/FormField';
import styles from './Step2_WorkExperience.module.css';

export const Step2_WorkExperience = () => {
    const { data, updateWorkExperience } = useApplication();
    const navigate = useNavigate();

    // Initialize with existing data or one empty block if empty?
    // User can add up to 10. Let's start with empty if none, or pre-fill.
    const [experiences, setExperiences] = useState<WorkExperience[]>(
        data.workExperience.length > 0 ? data.workExperience : []
    );

    // Global error message or specific field errors?
    // "if there are empty fields, the errors will appear next to the next button"
    // implies a general error message, but individual field validation is better UX.
    // I will implement both.
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleAddExperience = () => {
        if (experiences.length >= 10) return;

        const newExperience: WorkExperience = {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            description: '',
            isCurrentRole: false
        };
        setExperiences([...experiences, newExperience]);
    };

    const handleRemoveExperience = (id: string) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
        // Clear errors related to this ID
        const newErrors = { ...errors };
        Object.keys(newErrors).forEach(key => {
            if (key.startsWith(id)) delete newErrors[key];
        });
        setErrors(newErrors);
    };

    const handleChange = (id: string, field: keyof WorkExperience, value: any) => {
        setExperiences(experiences.map(exp => {
            if (exp.id === id) {
                // If toggling isCurrentRole, clear endDate if true
                if (field === 'isCurrentRole' && value === true) {
                    return { ...exp, [field]: value, endDate: '' };
                }
                return { ...exp, [field]: value };
            }
            return exp;
        }));

        // Clear error
        if (errors[`${id}.${field}`]) {
            setErrors(prev => ({ ...prev, [`${id}.${field}`]: '' }));
        }
        setGlobalError(null);
    };

    const validate = () => {
        let isValid = true;
        const newErrors: Record<string, string> = {};

        if (experiences.length === 0) {
            // Is it mandatory to have at least one?
            // "if there is no empty fields... the user will move to the next step"
            // Usually resumes implies at least one, but prompt doesn't explicitly say "Must have at least one".
            // However, "below the last block..." implies there is at least one block usually.
            // Let's assume at least one is NOT required strictly by schema unless defined so, 
            // BUT if they added a block it must be valid.
            // If the list is empty, proceed? 
            // "the user can add up to 10 work experience" -> implies optional count.
            // But let's check if they filled what they added.
        }

        experiences.forEach((exp) => {
            const result = workExperienceItemSchema.safeParse(exp);
            if (!result.success) {
                isValid = false;
                result.error.issues.forEach(err => {
                    // map Zod path to our error key format: id.field
                    // Zod path for object is just ['field']
                    const field = err.path[0];
                    newErrors[`${exp.id}.${String(field)}`] = err.message;
                });
            }

            // Additional validation: end date cannot be before start date
            if (!exp.isCurrentRole && exp.startDate && exp.endDate) {
                if (new Date(exp.endDate) < new Date(exp.startDate)) {
                    isValid = false;
                    newErrors[`${exp.id}.endDate`] = 'End date cannot be before start date';
                }
            }

            // Additional validation: start date cannot be in the future
            if (exp.startDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDate = new Date(exp.startDate);
                if (startDate > today) {
                    isValid = false;
                    newErrors[`${exp.id}.startDate`] = 'Start date cannot be in the future';
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validate()) {
            updateWorkExperience(experiences);
            navigate('/questionnaire');
        } else {
            setGlobalError("Please fill in all required fields correctly.");
        }
    };

    return (
        <div>
            <h2 className="summary-title">Work Experience</h2>

            {experiences.map((exp, index) => (
                <div key={exp.id} className={styles.experienceBlock}>
                    <div className={styles.header}>
                        <h3>Experience #{index + 1}</h3>
                        <button
                            onClick={() => handleRemoveExperience(exp.id)}
                            className={styles.deleteBtn}
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className={styles.gridContainer}>
                        <FormField
                            label="Company *"
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                            error={errors[`${exp.id}.company`]}
                        />

                        <FormField
                            label="Role *"
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                            error={errors[`${exp.id}.role`]}
                        />

                        <FormField
                            label="Start Date *"
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                            error={errors[`${exp.id}.startDate`]}
                        />

                        <div className="form-group">
                            <label className="form-label" htmlFor={`endDate-${exp.id}`}>End Date</label>
                            {!exp.isCurrentRole ? (
                                <input
                                    id={`endDate-${exp.id}`}
                                    type="date"
                                    value={exp.endDate}
                                    onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                                    className={`form-input ${errors[`${exp.id}.endDate`] ? 'error' : ''}`}
                                />
                            ) : (
                                <div className={styles.currentPosition}>Current Position</div>
                            )}
                            {errors[`${exp.id}.endDate`] && <p className="error-message">{errors[`${exp.id}.endDate`]}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={exp.isCurrentRole}
                                onChange={(e) => handleChange(exp.id, 'isCurrentRole', e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxText}>I still work here</span>
                        </label>
                    </div>

                    <FormField
                        label="Description *"
                        textarea
                        value={exp.description}
                        onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                        error={errors[`${exp.id}.description`]}
                        className={styles.textarea}
                    />
                </div>
            ))}

            {experiences.length < 10 && (
                <button onClick={handleAddExperience} className="btn btn-add">
                    <Plus size={18} className={styles.icon} /> Add Experience
                </button>
            )}

            <div className="actions-row with-errors">
                <div className={styles.flex1}>
                    {globalError && <span className="error-message">{globalError}</span>}
                </div>
                <div className={styles.flexContainer}>
                    <button className="btn btn-outline" onClick={() => navigate('/')}>
                        Back
                    </button>
                    <button className="btn btn-primary" onClick={handleNext}>
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
};
