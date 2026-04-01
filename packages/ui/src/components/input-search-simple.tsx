'use client';

import React from 'react';
import { cn } from '../utils/cn';

interface SearchIconProps {
  className?: string;
}

function SearchIcon({ className }: SearchIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      />
    </svg>
  );
}

function XIcon({ className }: SearchIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

interface InputSearchSimpleProps {
  className?: string;
  value?: string;
  containerClassName?: string;
  placeholder?: string;
  onChangeValue: (value: string) => void;
}

function InputSearchSimple({
  className,
  placeholder = 'Buscar',
  value,
  containerClassName,
  onChangeValue,
}: InputSearchSimpleProps) {
  const hasValue = Boolean(value && value.length > 0);

  return (
    <div
      className={cn(
        'relative w-full max-w-[320px] transition focus-within:shadow-[0_12px_30px_rgba(15,23,42,0.08)]',
        containerClassName,
      )}
    >
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        data-cy="search-bar-input"
        className={cn(
          'h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 outline-none transition',
          'focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10',
          '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
          hasValue && 'pr-10',
          className,
        )}
        placeholder={placeholder}
        onChange={(e) => onChangeValue(e.target.value)}
        value={value}
      />
      {hasValue ? (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => onChangeValue('')}
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export { InputSearchSimple };
