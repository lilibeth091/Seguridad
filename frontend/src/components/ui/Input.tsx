import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Form } from 'react-bootstrap';

interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  multiline?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  rows,
  multiline = false,
  error,
}) => {
  const { currentLibrary } = useTheme();

  if (currentLibrary === 'bootstrap') {
    // Bootstrap - Estilo clásico con bordes gruesos
    return (
      <Form.Group className={`mb-3 ${className}`}>
        {label && (
          <Form.Label className="fw-bold" style={{ fontSize: '0.95rem' }}>
            {label} {required && <span className="text-danger">*</span>}
          </Form.Label>
        )}
        <Form.Control
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          as={multiline ? 'textarea' : 'input'}
          rows={rows}
          isInvalid={!!error}
          style={{
            borderWidth: '2px',
            fontSize: '0.95rem',
            padding: '0.6rem 0.75rem'
          }}
        />
        {error && (
          <Form.Control.Feedback type="invalid" style={{ fontWeight: 600 }}>
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }

  // Tailwind CSS - Estilo moderno con efectos visuales
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
            font-medium text-gray-800
            ${error
              ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-200'
              : 'border-gray-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200'
            }
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            placeholder:text-gray-400 placeholder:font-normal
            shadow-sm hover:shadow-md focus:shadow-lg
          `}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
            font-medium text-gray-800
            ${error
              ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-200'
              : 'border-gray-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-200'
            }
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            placeholder:text-gray-400 placeholder:font-normal
            shadow-sm hover:shadow-md focus:shadow-lg
          `}
        />
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-semibold flex items-center gap-1">
          <span className="text-lg">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
