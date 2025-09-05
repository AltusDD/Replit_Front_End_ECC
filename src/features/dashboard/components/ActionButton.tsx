// src/features/dashboard/components/ActionButton.tsx
import React from 'react';
import { Link } from 'wouter';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
}

export function ActionButton({ 
  children, 
  onClick, 
  to, 
  variant = 'secondary',
  size = 'md' 
}: ActionButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
  `.trim();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    primary: `
      bg-[var(--altus-gold)] text-black hover:bg-[#c4a154] 
      focus:ring-[var(--altus-gold)] shadow-sm
    `.trim(),
    secondary: `
      border border-gray-500 text-[var(--altus-text)] hover:bg-gray-800
      focus:ring-gray-400
    `.trim(),
    danger: `
      bg-[var(--altus-bad)] text-white hover:bg-[#722e33]
      focus:ring-red-500
    `.trim(),
  };

  const className = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

  if (to) {
    return (
      <Link href={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}