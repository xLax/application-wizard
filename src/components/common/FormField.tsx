import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    textarea?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, textarea, className = '', id, ...props }) => {
    const Component = textarea ? 'textarea' : 'input';
    const inputId = id || props.name || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="form-group">
            <label className="form-label" htmlFor={inputId}>{label}</label>
            <Component
                id={inputId}
                className={`form-input ${error ? 'error' : ''} ${className}`}
                {...props}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};
