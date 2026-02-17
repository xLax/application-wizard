import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { FileText } from 'lucide-react';
import { personalInfoSchema } from '../../schemas/validation';
import { workExperienceItemSchema } from '../../schemas/validation';
import styles from './Step4_Summary.module.css';

export const Step4_Summary = () => {
    const { data } = useApplication();
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateAllSteps = (): { isValid: boolean; errorMessage: string; redirectTo?: string } => {
        // Validate Personal Info
        const personalInfoResult = personalInfoSchema.safeParse(data.personalInfo);
        if (!personalInfoResult.success) {
            return {
                isValid: false,
                errorMessage: 'Personal information is incomplete or invalid.',
                redirectTo: '/'
            };
        }

        // Validate Work Experience
        if (data.workExperience.length > 0) {
            for (const exp of data.workExperience) {
                const expResult = workExperienceItemSchema.safeParse(exp);
                if (!expResult.success) {
                    return {
                        isValid: false,
                        errorMessage: 'Work experience information is incomplete or invalid.',
                        redirectTo: '/work-experience'
                    };
                }
            }
        }

        // Validate Questionnaire - check for unanswered questions
        if (!data.questionnaire.legalAuthorization) {
            return {
                isValid: false,
                errorMessage: 'Please answer all questions in the questionnaire.',
                redirectTo: '/questionnaire'
            };
        }
        if (!data.questionnaire.availableIn30Days) {
            return {
                isValid: false,
                errorMessage: 'Please answer all questions in the questionnaire.',
                redirectTo: '/questionnaire'
            };
        }
        if (!data.questionnaire.relocationSupport) {
            return {
                isValid: false,
                errorMessage: 'Please answer all questions in the questionnaire.',
                redirectTo: '/questionnaire'
            };
        }

        // Validate CV File - check if it's an actual File object, not just metadata
        if (!data.questionnaire.cvFile || !(data.questionnaire.cvFile instanceof File)) {
            return {
                isValid: false,
                errorMessage: 'Please upload your CV. If you refreshed the page, you need to re-upload the file.',
                redirectTo: '/questionnaire'
            };
        }

        return { isValid: true, errorMessage: '' };
    };

    const handleSubmit = () => {
        const validation = validateAllSteps();

        if (!validation.isValid) {
            setValidationError(validation.errorMessage);
            // Optionally navigate to the step with errors after a delay
            if (validation.redirectTo) {
                setTimeout(() => {
                    navigate(validation.redirectTo!);
                }, 3000);
            }
            return;
        }

        // Here you would typically send data to a backend
        console.log("Submitting Application:", data);
        navigate('/thank-you');
    };

    return (
        <div>
            {validationError && (
                <div className={styles.validationError}>
                    {validationError}
                </div>
            )}

            <h2 className={styles.pageTitle}>Review Your Application</h2>

            {/* Personal Info */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className={styles.grid}>
                    <div>
                        <label className={styles.label}>Full Name</label>
                        <p className={styles.value}>{data.personalInfo.fullName}</p>
                    </div>
                    <div>
                        <label className={styles.label}>Email</label>
                        <p className={styles.value}>{data.personalInfo.email}</p>
                    </div>
                    <div>
                        <label className={styles.label}>Phone</label>
                        <p className={styles.value}>{data.personalInfo.phone}</p>
                    </div>
                    <div>
                        <label className={styles.label}>Location</label>
                        <p className={styles.value}>{data.personalInfo.city}, {data.personalInfo.country}</p>
                    </div>
                    {data.personalInfo.linkedinUrl && (
                        <div>
                            <label className={styles.label}>LinkedIn</label>
                            <p className={styles.link}>{data.personalInfo.linkedinUrl}</p>
                        </div>
                    )}
                    {data.personalInfo.gitUrl && (
                        <div>
                            <label className={styles.label}>GitHub</label>
                            <p className={styles.link}>{data.personalInfo.gitUrl}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Work Experience */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Work Experience</h3>
                {data.workExperience.length === 0 ? (
                    <p className={styles.noExperience}>No work experience added.</p>
                ) : (
                    <div className={styles.experienceParams}>
                        {data.workExperience.map((exp) => (
                            <div key={exp.id} className={styles.experienceCard}>
                                <h4 className={styles.roleTitle}>{exp.role} at {exp.company}</h4>
                                <p className={styles.dateRange}>
                                    {exp.startDate} — {exp.isCurrentRole ? 'Present' : exp.endDate}
                                </p>
                                <p className={styles.description}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Questionnaire */}
            <section className={`${styles.section} ${styles.lastSection}`}>
                <h3 className={styles.sectionTitle}>Additional Information</h3>
                <div className={styles.questionsContainer}>
                    <div className={styles.questionRow}>
                        <span className={styles.questionLabel}>Legal Authorization Constraints?</span>
                        <span className={styles.questionAnswer}>{data.questionnaire.legalAuthorization}</span>
                    </div>
                    <div className={styles.questionRow}>
                        <span className={styles.questionLabel}>Available in 30 days?</span>
                        <span className={styles.questionAnswer}>{data.questionnaire.availableIn30Days}</span>
                    </div>
                    <div className={styles.questionRow}>
                        <span className={styles.questionLabel}>Relocation Support?</span>
                        <span className={styles.questionAnswer}>{data.questionnaire.relocationSupport}</span>
                    </div>
                    <div className={styles.fileAttachment}>
                        <FileText className={styles.fileIcon} />
                        <div>
                            <p className={styles.fileLabel}>Attached CV</p>
                            <p className={styles.fileName}>{data.questionnaire.cvFile?.name || "No file uploaded"}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="actions-row">
                <button className="btn btn-outline" onClick={() => navigate('/questionnaire')}>
                    Back
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit Application
                </button>
            </div>
        </div>
    );
};
