import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { FileText } from 'lucide-react';

export const Step4_Summary = () => {
    const { data } = useApplication();
    const navigate = useNavigate();

    const handleSubmit = () => {
        // Here you would typically send data to a backend
        console.log("Submitting Application:", data);
        navigate('/thank-you');
    };

    return (
        <div>
            <h2 className="summary-title text-center text-2xl mb-8">Review Your Application</h2>

            {/* Personal Info */}
            <section className="summary-section">
                <h3 className="text-lg font-semibold text-primary mb-4">Personal Information</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <label>Full Name</label>
                        <p>{data.personalInfo.fullName}</p>
                    </div>
                    <div className="summary-item">
                        <label>Email</label>
                        <p>{data.personalInfo.email}</p>
                    </div>
                    <div className="summary-item">
                        <label>Phone</label>
                        <p>{data.personalInfo.phone}</p>
                    </div>
                    <div className="summary-item">
                        <label>Location</label>
                        <p>{data.personalInfo.city}, {data.personalInfo.country}</p>
                    </div>
                    {data.personalInfo.linkedinUrl && (
                        <div className="summary-item">
                            <label>LinkedIn</label>
                            <p className="truncate text-indigo-600">{data.personalInfo.linkedinUrl}</p>
                        </div>
                    )}
                    {data.personalInfo.gitUrl && (
                        <div className="summary-item">
                            <label>GitHub</label>
                            <p className="truncate text-indigo-600">{data.personalInfo.gitUrl}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Work Experience */}
            <section className="summary-section">
                <h3 className="text-lg font-semibold text-primary mb-4">Work Experience</h3>
                {data.workExperience.length === 0 ? (
                    <p className="text-gray-500 italic">No work experience added.</p>
                ) : (
                    <div className="space-y-4">
                        {data.workExperience.map((exp, i) => (
                            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-gray-800">{exp.role} at {exp.company}</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    {exp.startDate} — {exp.isCurrentRole ? 'Present' : exp.endDate}
                                </p>
                                <p className="text-gray-700 whitespace-pre-wrap text-sm">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Questionnaire */}
            <section className="summary-section border-b-0">
                <h3 className="text-lg font-semibold text-primary mb-4">Additional Information</h3>
                <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Legal Authorization Constraints?</span>
                        <span className="font-medium capitalize">{data.questionnaire.legalAuthorization}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Available in 30 days?</span>
                        <span className="font-medium capitalize">{data.questionnaire.availableIn30Days}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600">Relocation Support?</span>
                        <span className="font-medium capitalize">{data.questionnaire.relocationSupport}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <FileText className="text-indigo-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Attached CV</p>
                            <p className="text-xs text-indigo-600">{data.questionnaire.cvFile?.name || "No file uploaded"}</p>
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
