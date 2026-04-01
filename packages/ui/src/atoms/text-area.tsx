'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, maxLength, className, onChange, id, ...rest }, ref) => {
    const [length, setLength] = React.useState(0);
    const textareaId = id || rest.name;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700 mb-1.5 block"
          >
            {label}
            {rest.required && (
              <span className="ml-0.5 text-red-500">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            maxLength={maxLength}
            onChange={handleChange}
            className={cn(
              'w-full px-3.5 py-2.5 border rounded-lg shadow-sm text-gray-900 placeholder:text-gray-500 bg-transparent transition-colors resize-none',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500',
              maxLength && 'pr-24',
            )}
            {...rest}
          />
          {maxLength !== undefined && (
            <span className="absolute right-3 bottom-2.5 text-sm text-gray-400">
              {length}/{maxLength}
            </span>
          )}
        </div>
        {error && (
          <span className="text-red-600 text-sm mt-1.5 block">{error}</span>
        )}
      </div>
    );
  },
);
TextArea.displayName = 'TextArea';

export { TextArea };
