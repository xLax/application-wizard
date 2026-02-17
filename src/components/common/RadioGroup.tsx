import React from 'react';

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
    options = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    selectedValue,
    onChange,
    error
}) => {
    return (
        <div className="form-group">
            <label className="form-label text-base">{label}</label>
            <div className="flex gap-6 mt-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => onChange(option.value)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};
