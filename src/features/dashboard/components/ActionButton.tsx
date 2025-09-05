// ActionButton.tsx - Genesis specification reusable button component

import React from 'react';
import { Link } from 'wouter';

interface ActionButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  'data-testid'?: string;
}

export function ActionButton({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  'data-testid': testId,
}: ActionButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    primary: `
      bg-[var(--altus-gold)] text-[var(--altus-black)] font-semibold
      hover:bg-[#e0c373] focus-visible:ring-[var(--altus-gold)]
    `,
    secondary: `
      border border-[var(--altus-outline)] text-[var(--altus-text)]
      hover:bg-[var(--altus-panel-2)] focus-visible:ring-[var(--altus-text)]
    `,
    danger: `
      bg-[var(--altus-bad)] text-white font-medium
      hover:bg-[#914049] focus-visible:ring-[var(--altus-bad)]
    `,
  };

  const allClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (to) {
    return (
      <Link href={to}>
        <a className={allClasses} data-testid={testId}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={allClasses}
      data-testid={testId}
    >
      {children}
    </button>
  );
}