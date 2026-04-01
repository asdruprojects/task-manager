'use client';

import React from 'react';

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const rules = [
  {
    id: 'length',
    label: 'Entre 8 y 64 caracteres',
    test: (pwd: string) => pwd.length >= 8 && pwd.length <= 64,
  },
  {
    id: 'uppercase',
    label: 'Al menos una letra mayúscula',
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    id: 'lowercase',
    label: 'Al menos una letra minúscula',
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'Al menos un número',
    test: (pwd: string) => /\d/.test(pwd),
  },
  {
    id: 'special',
    label: 'Al menos un carácter especial (@$!%*?&)',
    test: (pwd: string) => /[@$!%*?&]/.test(pwd),
  },
];

interface PasswordValidationsProps {
  password: string;
}

function PasswordValidations({ password }: PasswordValidationsProps) {
  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      {rules.map((rule) => {
        const isValid = rule.test(password);
        return (
          <div key={rule.id} className="flex items-center gap-2 text-sm">
            <CheckCircleIcon
              className={`size-4 shrink-0 transition-colors ${
                isValid ? 'text-emerald-500' : 'text-slate-300'
              }`}
            />
            <span
              className={`transition-colors ${
                isValid ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { PasswordValidations };
