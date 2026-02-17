import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    textarea?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, textarea, className = '', ...props }) => {
    const Component = textarea ? 'textarea' : 'input';

    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <Component
                className={`form-input ${error ? 'error' : ''} ${className}`}
                {...props}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};
