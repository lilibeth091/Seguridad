import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button as BootstrapButton } from 'react-bootstrap';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon,
  fullWidth = false,
  size = 'medium',
}) => {
  const { currentLibrary } = useTheme();

  if (currentLibrary === 'bootstrap') {
    // Bootstrap - Estilo Bootstrap clásico
    const bsVariant = variant === 'primary' ? 'primary' :
                      variant === 'secondary' ? 'secondary' :
                      variant === 'success' ? 'success' :
                      variant === 'danger' ? 'danger' :
                      'warning';

    const bsSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : undefined;

    return (
      <BootstrapButton
        onClick={onClick}
        type={type}
        variant={bsVariant}
        disabled={disabled}
        size={bsSize}
        className={`${fullWidth ? 'w-100' : ''} ${className}`}
        style={{
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          borderWidth: '2px',
        }}
      >
        {icon}
        {children}
      </BootstrapButton>
    );
  }

  // Tailwind CSS - Estilo moderno con degradados y sombras pronunciadas
  const variantStyles = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      hover: 'hover:from-blue-700 hover:to-blue-800',
      shadow: 'shadow-blue-500/50',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-gradient-to-r from-gray-600 to-gray-700',
      hover: 'hover:from-gray-700 hover:to-gray-800',
      shadow: 'shadow-gray-500/50',
      text: 'text-white'
    },
    success: {
      bg: 'bg-gradient-to-r from-green-600 to-green-700',
      hover: 'hover:from-green-700 hover:to-green-800',
      shadow: 'shadow-green-500/50',
      text: 'text-white'
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-600 to-red-700',
      hover: 'hover:from-red-700 hover:to-red-800',
      shadow: 'shadow-red-500/50',
      text: 'text-white'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      hover: 'hover:from-yellow-600 hover:to-yellow-700',
      shadow: 'shadow-yellow-500/50',
      text: 'text-white'
    },
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-5 py-2.5 text-sm',
    large: 'px-7 py-3.5 text-base',
  };

  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        ${styles.bg}
        ${styles.hover}
        ${styles.text}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        inline-flex items-center justify-center gap-2 rounded-xl
        shadow-lg ${styles.shadow} hover:shadow-xl
        transition-all duration-200 font-bold
        border-2 border-white/20
        ${className}
      `}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
