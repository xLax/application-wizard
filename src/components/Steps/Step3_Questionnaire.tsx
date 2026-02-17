import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { questionnaireSchema } from '../../schemas/validation';
import type { Questionnaire } from '../../types';
import { Upload } from 'lucide-react';
import { RadioGroup } from '../common/RadioGroup';
import styles from './Step3_Questionnaire.module.css';

export const Step3_Questionnaire = () => {
    const { data, updateQuestionnaire } = useApplication();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState<Questionnaire>(data.questionnaire);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    const handleRadioChange = (name: keyof Questionnaire, value: string) => {
        setAnswers(prev => ({ ...prev, [name]: value }));
        // Clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setGlobalError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAnswers(prev => ({ ...prev, cvFile: file }));
        if (errors.cvFile) {
            setErrors(prev => ({ ...prev, cvFile: '' }));
        }
        setGlobalError(null);
    };

    const handleNext = () => {
        // Additional validation for empty strings (unanswered questions)
        const validationErrors: Record<string, string> = {};

        if (answers.legalAuthorization === '') {
            validationErrors.legalAuthorization = 'Please answer this question';
        }
        if (answers.availableIn30Days === '') {
            validationErrors.availableIn30Days = 'Please answer this question';
        }
        if (answers.relocationSupport === '') {
            validationErrors.relocationSupport = 'Please answer this question';
        }
        if (!answers.cvFile) {
            validationErrors.cvFile = 'Please upload your CV';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setGlobalError("Please answer all questions and upload your CV.");
            return;
        }

        const result = questionnaireSchema.safeParse(answers);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                const path = err.path[0] as string;
                formattedErrors[path] = err.message;
            });
            setErrors(formattedErrors);
            setGlobalError("Please answer all questions and upload your CV.");
        } else {
            updateQuestionnaire(answers);
            navigate('/summary');
        }
    };

    return (
        <div>
            <h2 className="summary-title">Additional Information</h2>

            <div className={styles.container}>
                <RadioGroup
                    label="Are there any legal work authorization constraints? *"
                    name="legalAuthorization"
                    selectedValue={answers.legalAuthorization || ''}
                    onChange={(val) => handleRadioChange('legalAuthorization', val)}
                    error={errors.legalAuthorization}
                />

                <RadioGroup
                    label="Are you available to start within 30 days? *"
                    name="availableIn30Days"
                    selectedValue={answers.availableIn30Days || ''}
                    onChange={(val) => handleRadioChange('availableIn30Days', val)}
                    error={errors.availableIn30Days}
                />

                <RadioGroup
                    label="Do you require relocation support? *"
                    name="relocationSupport"
                    selectedValue={answers.relocationSupport || ''}
                    onChange={(val) => handleRadioChange('relocationSupport', val)}
                    error={errors.relocationSupport}
                />

                <div className={`${styles.fileUploadGroup} form-group`}>
                    <label className="form-label">Upload CV (PDF/DOCX) *</label>
                    <div className={`${styles.uploadArea} ${errors.cvFile ? styles.uploadAreaError : ''}`}>
                        <div className={styles.uploadContent}>
                            <Upload className={styles.uploadIcon} />
                            <div className={styles.uploadTextContainer}>
                                <label
                                    htmlFor="file-upload"
                                    className={styles.uploadLabel}
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className={styles.visuallyHidden} accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} />
                                </label>
                                <p className={styles.dragText}>or drag and drop</p>
                            </div>
                            <p className={styles.fileInfo}>
                                PDF, DOCX up to 10MB
                            </p>
                            {answers.cvFile && (
                                <p className={styles.selectedFile}>
                                    Selected: {answers.cvFile.name}
                                </p>
                            )}
                        </div>
                    </div>
                    {errors.cvFile && <p className="error-message text-center mt-2">{errors.cvFile}</p>}
                </div>
            </div>

            <div className="actions-row with-errors">
                <div className={styles.flex1}>
                    {globalError && <span className="error-message">{globalError}</span>}
                </div>
                <div className={styles.flexContainer}>
                    <button className="btn btn-outline" onClick={() => navigate('/work-experience')}>
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
