// ActionButton.tsx - Genesis v2 specification with keyboard accessibility
import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '' 
}: ActionButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--altus-black)] active:scale-95";
  
  const variantClasses = {
    primary: "bg-[var(--altus-gold)] text-[var(--altus-black)] hover:bg-[#c5a560] hover:shadow-lg hover:scale-105 focus:ring-[var(--altus-gold)] active:bg-[#b09550]",
    secondary: "border border-[var(--line)] text-[var(--text)] bg-transparent hover:bg-[var(--panel-elev)] hover:border-[var(--altus-gold)]/50 hover:text-[var(--altus-gold)] focus:ring-[var(--altus-gold)] focus:border-[var(--altus-gold)]",
    danger: "bg-[var(--bad)] text-white hover:bg-[#e14d47] hover:shadow-lg hover:scale-105 focus:ring-[var(--bad)] active:bg-[#d43e38]"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";
  
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled ? disabledClasses : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-${variant}-${size}`}
    >
      {children}
    </button>
  );
}