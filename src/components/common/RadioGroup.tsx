import React from 'react';
import styles from './RadioGroup.module.css';


interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    label: string;
    name: string;
    options?: RadioOption[];
    selectedValue: string;
    onChange: (value: string) => void;
    error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    name,
    options = [{ label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }],
    selectedValue,
    onChange,
    error
}) => {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div className={styles.container}>
                {options.map((option) => (
                    <label key={option.value} className={styles.option}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value ? true : undefined}
                            onChange={() => onChange(option.value)}
                            className={styles.radio}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};
