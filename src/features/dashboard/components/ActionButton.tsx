// Genesis Grade Action Button - Sophisticated CTA Component

import React from 'react';
import { Link } from 'wouter';

interface ActionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({ 
  children, 
  href, 
  onClick,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  className = ''
}: ActionButtonProps) {
  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const baseClasses = `
    action-btn 
    action-btn--${variant} 
    ${sizeClasses[size]} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `.trim();

  const content = (
    <>
      {icon && <span className="action-btn__icon">{icon}</span>}
      <span className="action-btn__text">{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href}>
        <button className={baseClasses} disabled={disabled}>
          {content}
        </button>
      </Link>
    );
  }

  return (
    <button 
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}