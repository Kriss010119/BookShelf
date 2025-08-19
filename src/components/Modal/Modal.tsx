import React from 'react';
import styles from './Modal.module.css';

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, title, onClose, children } : ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;