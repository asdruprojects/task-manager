'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md';
  /**
   * tint = fondo azul muy suave (correo), como la referencia guao.
   * white = fondo blanco (nombre, apellidos, etc.).
   */
  shell?: 'tint' | 'white';
}

/**
 * Misma idea que el Input de referencia: contenedor flex h-11, borde suave,
 * input interno sin borde con px-4 (padding real del texto).
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      rightIcon,
      className,
      id,
      inputSize = 'md',
      shell = 'white',
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <label htmlFor={inputId} className={cn('block w-full', className)}>
        {label ? (
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
            {props.required ? (
              <span className="ml-0.5 text-indigo-600">*</span>
            ) : null}
          </span>
        ) : null}

        <div
          className={cn(
            'flex w-full flex-row items-center overflow-hidden rounded-lg border shadow-sm transition-[box-shadow,border-color,background-color]',
            inputSize === 'sm' ? 'h-10' : 'h-11',
            error
              ? 'border-red-300 bg-red-50 focus-within:ring-2 focus-within:ring-red-500/25'
              : [
                  'border-slate-200',
                  shell === 'tint' && 'bg-sky-50/90',
                  shell === 'white' && 'bg-white',
                  'focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20',
                ],
            props.disabled && 'bg-slate-100 opacity-90',
          )}
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'm-0 h-full min-h-0 min-w-0 flex-1 border-0 bg-transparent px-4 text-slate-900',
              inputSize === 'sm' ? 'text-sm' : 'text-base',
              inputSize === 'sm'
                ? 'placeholder:text-slate-400 placeholder:text-sm'
                : 'placeholder:text-slate-400 placeholder:text-base',
              'outline-none ring-0 focus:outline-none focus:ring-0',
              rightIcon && 'pr-2',
              props.disabled && 'cursor-not-allowed text-slate-500',
            )}
            {...props}
          />
          {rightIcon ? (
            <div className="flex h-full shrink-0 items-center pr-3">{rightIcon}</div>
          ) : null}
        </div>

        {error ? (
          <span className="mt-1.5 block text-sm text-red-600">{error}</span>
        ) : null}
      </label>
    );
  },
);
Input.displayName = 'Input';

export { Input };
