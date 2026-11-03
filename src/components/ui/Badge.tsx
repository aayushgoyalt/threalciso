import React from 'react';

export type SeverityType = 'critical' | 'high' | 'medium' | 'low' | 'none';

interface BadgeProps {
  children: React.ReactNode;
  severity?: SeverityType;
  variant?: 'outline' | 'solid' | 'subtle';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  severity,
  variant = 'subtle',
  className = '',
  size = 'sm',
}: BadgeProps) {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (severity === 'critical') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (severity === 'high') {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (severity === 'medium') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (severity === 'low') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium uppercase tracking-wider rounded border ${colorClasses} ${sizeClasses} ${className}`}
    >
      {severity && severity !== 'none' && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            severity === 'critical'
              ? 'bg-rose-600'
              : severity === 'high'
              ? 'bg-orange-500'
              : severity === 'medium'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />
      )}
      {children}
    </span>
  );
}

