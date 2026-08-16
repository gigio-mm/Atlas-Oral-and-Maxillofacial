'use client';

import React from 'react';
import { Info, Target } from 'lucide-react';
import { Muscle } from '@/constants/muscleData';

interface MuscleInfoCardProps {
    /** The currently active muscle, or null if none is selected. */
    muscle: Muscle | null;
    /** If true, uses a more compact layout for constrained spaces (e.g. mobile). */
    compact?: boolean;
    /** Contextual hint text shown when no muscle is selected. */
    contextHint?: string;
}

export default function MuscleInfoCard({ muscle, compact = false, contextHint }: MuscleInfoCardProps) {
    if (muscle) {
        return (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                {/* ── Muscle Title ── */}
                <h2 className={`font-heading font-bold text-slate-100 flex items-center gap-2 leading-snug
                    ${compact ? 'text-sm mb-2.5' : 'text-lg mb-4'}`}
                >
                    {muscle.name}
                </h2>

                {/* ── Glassmorphism Card ── */}
                <div className={`bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/20
                    ${compact ? 'p-4 rounded-xl' : 'p-6 rounded-2xl'}`}
                >
                    <div className={`flex items-center gap-2 text-blue-500
                        ${compact ? 'mb-2' : 'mb-3'}`}
                    >
                        <Target className={compact ? 'w-4 h-4 shrink-0' : 'w-5 h-5 shrink-0'} />
                        <h3 className={`font-sans font-bold uppercase tracking-widest text-blue-500/80
                            ${compact ? 'text-[0.6rem]' : 'text-xs'}`}
                        >Acidente Anatômico</h3>
                    </div>
                    <h4 className={`font-sans font-semibold text-slate-200 leading-relaxed
                        ${compact ? 'text-sm' : 'text-md'}`}
                    >
                        {muscle.anatomicalAccident.title}
                    </h4>
                </div>
            </div>
        );
    }

    // ── Empty state ──
    return (
        <div className={`flex flex-col items-center justify-center text-center text-slate-500 animate-in fade-in duration-300
            ${compact ? 'p-2' : 'p-4'}`}
        >
            <div className={`mb-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner
                ${compact ? 'w-10 h-10' : 'w-16 h-16 mb-4'}`}
            >
                <Info className={compact ? 'w-5 h-5 text-slate-600' : 'w-8 h-8 text-slate-600'} />
            </div>
            <p className={`font-sans font-medium text-slate-400 leading-relaxed
                ${compact ? 'text-xs' : 'text-sm'}`}
            >
                {contextHint || 'Selecione um músculo para ver o acidente anatômico.'}
            </p>
        </div>
    );
}
