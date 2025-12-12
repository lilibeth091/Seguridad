import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const { currentLibrary } = useTheme();

  if (currentLibrary === 'bootstrap') {
    // Bootstrap - Modal clásico con animaciones
    const bsSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : undefined;

    return (
      <BootstrapModal
        show={isOpen}
        onHide={onClose}
        size={bsSize}
        centered
        backdrop="static"
        animation
      >
        <BootstrapModal.Header closeButton className="border-bottom">
          <BootstrapModal.Title className="fw-bold">
            {title}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="p-4">
          {children}
        </BootstrapModal.Body>
        {footer && (
          <BootstrapModal.Footer className="border-top">
            {footer}
          </BootstrapModal.Footer>
        )}
      </BootstrapModal>
    );
  }

  // Tailwind CSS - Modal personalizado con backdrop blur
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-full p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
