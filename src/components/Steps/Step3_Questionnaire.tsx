import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { questionnaireSchema } from '../../schemas/validation';
import type { Questionnaire } from '../../types';
import { Upload } from 'lucide-react';
import { RadioGroup } from '../common/RadioGroup';

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

            <div className="space-y-6">
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

                <div className="form-group pt-4 border-t border-gray-100">
                    <label className="form-label text-base">Upload CV (PDF/DOCX) *</label>
                    <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${errors.cvFile ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                        <div className="space-y-1 text-center relative">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PDF, DOCX up to 10MB
                            </p>
                            {answers.cvFile && (
                                <p className="text-sm font-semibold text-indigo-600 mt-2">
                                    Selected: {answers.cvFile.name}
                                </p>
                            )}
                        </div>
                    </div>
                    {errors.cvFile && <p className="error-message text-center mt-2">{errors.cvFile}</p>}
                </div>
            </div>

            <div className="actions-row with-errors">
                <div className="flex-1">
                    {globalError && <span className="error-message">{globalError}</span>}
                </div>
                <div className="flex gap-4">
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
