import React from 'react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttons}>
                    <button className="btn btn-outline" onClick={onCancel}>
                        No
                    </button>
                    <button className="btn btn-primary" onClick={onConfirm}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};
