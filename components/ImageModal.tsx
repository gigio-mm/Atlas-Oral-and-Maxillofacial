'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Muscle } from '@/types/anatomy';
import AnatomyImageViewer from '@/components/AnatomyImageViewer';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    muscle: Muscle | null;
}

/**
 * Full-screen image viewer for the anatomy canvas.
 * The dialog deliberately keeps the same dark glass language as the viewer,
 * while giving the artwork enough space to be inspected comfortably.
 */
export default function ImageModal({ isOpen, onClose, muscle }: ImageModalProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== 'Tab' || !dialogRef.current) return;

            const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ));
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen || !muscle) return null;

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Ampliação: ${muscle.name}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in duration-300 sm:p-8"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar ampliação"
                title="Fechar ampliação (Esc)"
                className="absolute right-4 top-4 z-[110] rounded-full border border-white/10 bg-slate-900/80 p-3 text-slate-300 shadow-2xl shadow-black/50 transition-all duration-300 hover:border-white/25 hover:bg-slate-800 hover:text-white active:scale-95 sm:right-7 sm:top-7"
            >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div
                className="flex h-full w-full max-w-7xl items-center justify-center animate-in zoom-in-95 duration-300"
                onClick={(event) => event.stopPropagation()}
            >
                <AnatomyImageViewer muscle={muscle} variant="modal" />
            </div>
        </div>
    );
}
