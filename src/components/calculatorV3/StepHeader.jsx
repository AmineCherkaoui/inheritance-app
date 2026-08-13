import React from 'react';
import { cn } from '../../utils';

export default function StepHeader({
  title,
  icon: Icon,
  subtitle,
  className
}) {
  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-primary-950" />

        <div className="relative z-10 mx-auto flex items-center justify-center gap-2 bg-secondary-50 px-8 text-base font-black text-primary-950 sm:text-lg">
          {Icon && (
            React.isValidElement(Icon) ? Icon : <Icon size={18} />
          )}
          <span>{title}</span>
        </div>
      </div>

      {subtitle && (
        <p className="text-center text-xs text-primary-950/80 -mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
