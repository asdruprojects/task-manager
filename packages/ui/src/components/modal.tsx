'use client';

import React from 'react';
import { cn } from '../utils/cn';
import { Button } from '../atoms/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: {
    primaryText?: string;
    primaryVariant?: 'default' | 'destructive';
    cancelText?: string;
    onPrimary?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
  };
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        className={cn(
          'relative w-full max-w-lg bg-white rounded-2xl shadow-xl',
          className,
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
                aria-label="Cerrar"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-4">{children}</div>

        {actions && (
          <div className="px-6 pb-6 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary-gray"
                onClick={actions.onCancel ?? onClose}
              >
                {actions.cancelText ?? 'Cancelar'}
              </Button>
              <Button
                variant={
                  actions.primaryVariant === 'destructive'
                    ? 'destructive'
                    : 'default'
                }
                onClick={actions.onPrimary}
                disabled={actions.isLoading}
              >
                {actions.isLoading
                  ? 'Procesando...'
                  : (actions.primaryText ?? 'Confirmar')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
