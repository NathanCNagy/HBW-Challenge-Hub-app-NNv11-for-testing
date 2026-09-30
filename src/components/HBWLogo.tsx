import React from 'react';

export interface HBWLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  ariaLabel?: string;
  variant?: 'full' | 'favicon';
}

export default function HBWLogo({ 
  className = '', 
  size = 'md', 
  theme = 'light',
  ariaLabel = 'Habits for a Better World',
  variant = 'full'
}: HBWLogoProps) {
  if (variant === 'favicon') {
    const faviconSizeClasses: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-14 w-14',
      xl: 'h-20 w-20',
    };

    return (
      <svg 
        className={`shrink-0 select-none ${faviconSizeClasses[size]} ${className}`} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
      >
        {/* Left semi-circle: vibrant blue (#0080FF) from Favicon version */}
        <path 
          d="M 50 6 A 44 44 0 0 0 50 94 Z" 
          fill="#0080FF" 
        />
      </svg>
    );
  }

  const sizeClasses: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  const primaryFill = theme === 'dark' ? '#FFFFFF' : '#1C1C1E';
  const accentFill = '#0080FF';

  return (
    <svg 
      className={`shrink-0 w-auto select-none ${sizeClasses[size]} ${className}`} 
      viewBox="0 0 160 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Left semi-circle: vibrant blue (#0080FF) */}
      <path 
        d="M50 0 A50 50 0 0 0 50 100 Z" 
        fill={accentFill} 
      />

      {/* 4-tier Stacked Brand Wordmark */}
      <g 
        fontFamily="'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontWeight="800" 
        fontSize="21.5" 
        letterSpacing="0.04em"
      >
        <text x="59" y="22" fill={primaryFill}>HABITS</text>
        <text x="59" y="47.5" fill={primaryFill}>FOR A</text>
        <text x="59" y="73" fill={accentFill}>BETTER</text>
        <text x="59" y="98" fill={primaryFill}>WORLD</text>
      </g>
    </svg>
  );
}
