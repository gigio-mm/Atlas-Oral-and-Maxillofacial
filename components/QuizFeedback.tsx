'use client';

import React from 'react';
import { Trophy, Target, Brain, ArrowRight, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';
import type { QuestionResult } from '@/types/anatomy';

interface QuizFeedbackProps {
    results: QuestionResult[];
    onGoToAtlas: () => void;
    onReview: () => void;
    onReviewOnlyErrors: () => void;
}

export default function QuizFeedback({ results, onGoToAtlas, onReview, onReviewOnlyErrors }: QuizFeedbackProps) {
    const total = results.length;
    const musclesCorrect = results.filter(r => r.muscleCorrect).length;
    const accidentsCorrect = results.filter(r => r.accidentCorrect).length;
    const completeCorrect = results.filter(r => r.muscleCorrect && r.accidentCorrect).length;
    const incorrectResults = results.filter(r => !r.muscleCorrect || !r.accidentCorrect);

    const musclePct = Math.round((musclesCorrect / total) * 100);
    const accidentPct = Math.round((accidentsCorrect / total) * 100);
    const completePct = Math.round((completeCorrect / total) * 100);

    // ── Determinar foco de estudo ──
    const getFocusRecommendation = () => {
        const muscleScore = musclesCorrect / total;
        const accidentScore = accidentsCorrect / total;

        if (muscleScore >= 0.8 && accidentScore >= 0.8) {
            return {
                icon: <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />,
                title: 'Excelente desempenho!',
                description: 'Você demonstrou um ótimo domínio tanto dos músculos quanto dos acidentes anatômicos. Continue revisando para manter o conhecimento afiado.',
                color: 'emerald',
                bgClass: 'bg-emerald-500/10 border-emerald-500/30',
                textClass: 'text-emerald-400',
            };
        }

        if (muscleScore < 0.5 && accidentScore < 0.5) {
            return {
                icon: <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />,
                title: 'Foco: Estudo Completo',
                description: 'É recomendado revisar tanto os músculos quanto os acidentes anatômicos. Utilize o Guia Atlas para estudar cada estrutura com calma.',
                color: 'amber',
                bgClass: 'bg-amber-500/10 border-amber-500/30',
                textClass: 'text-amber-400',
            };
        }

        if (muscleScore < accidentScore) {
            return {
                icon: <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />,
                title: 'Foco: Músculos',
                description: 'Você tem um bom conhecimento dos acidentes anatômicos, mas precisa reforçar a identificação dos músculos. Foque nos nomes e localizações.',
                color: 'blue',
                bgClass: 'bg-blue-500/10 border-blue-500/30',
                textClass: 'text-blue-400',
            };
        }

        return {
            icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />,
            title: 'Foco: Acidentes Anatômicos',
            description: 'Você identifica bem os músculos, mas precisa melhorar nos acidentes anatômicos. Revise as inserções e origens de cada músculo.',
            color: 'purple',
            bgClass: 'bg-purple-500/10 border-purple-500/30',
            textClass: 'text-purple-400',
        };
    };

    const focus = getFocusRecommendation();

    // ── Renderiza barra de progresso circular (ring) ──
    const renderStatCard = (
        label: string,
        correct: number,
        pct: number,
        icon: React.ReactNode,
        colorFrom: string,
        colorTo: string,
    ) => {
        const circumference = 2 * Math.PI * 40;
        const strokeDashoffset = circumference - (pct / 100) * circumference;

        return (
            <div className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-slate-900/60 rounded-2xl border border-slate-800/60 backdrop-blur-sm transition-all hover:border-slate-700/80">
                {/* Circular ring */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
                        <circle
                            cx="50" cy="50" r="40" fill="none"
                            strokeWidth="6" strokeLinecap="round"
                            stroke={`url(#gradient-${label})`}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={colorFrom} />
                                <stop offset="100%" stopColor={colorTo} />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-heading font-bold text-white">{pct}%</span>
                    </div>
                </div>
                {/* Icon + label */}
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs sm:text-sm font-heading font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
                </div>
                <span className="text-xs text-slate-500">{correct} de {total} corretos</span>
            </div>
        );
    };

    return (
        <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col items-center overflow-y-auto">
            {/* Header */}
            <header className="w-full px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h1 className="text-base sm:text-lg font-heading font-semibold text-slate-200">Resultado do Quiz</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 w-full max-w-3xl flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-8 pb-8">
                {/* Score cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
                    {renderStatCard(
                        'Músculos', musclesCorrect, musclePct,
                        <Brain className="w-4 h-4 text-blue-400" />,
                        '#3b82f6', '#6366f1'
                    )}
                    {renderStatCard(
                        'Acidentes', accidentsCorrect, accidentPct,
                        <Target className="w-4 h-4 text-purple-400" />,
                        '#a855f7', '#ec4899'
                    )}
                    {renderStatCard(
                        'Completos', completeCorrect, completePct,
                        <Trophy className="w-4 h-4 text-amber-400" />,
                        '#f59e0b', '#ef4444'
                    )}
                </div>

                {/* Focus recommendation */}
                <div className={`w-full rounded-2xl border p-5 sm:p-6 ${focus.bgClass} transition-all`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="shrink-0 mt-0.5">{focus.icon}</div>
                        <div>
                            <h2 className={`text-base sm:text-lg font-heading font-bold ${focus.textClass} mb-1`}>
                                {focus.title}
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {focus.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-2xl">
                    <button
                        onClick={onReview}
                        className="w-full sm:flex-1 group inline-flex items-center justify-center gap-3 px-6 py-4 text-sm sm:text-base font-heading font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all duration-300 rounded-full border border-slate-700/60 hover:border-slate-600 shadow-lg active:scale-95 cursor-pointer"
                    >
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        <span>Revisar Prova</span>
                    </button>
                    {incorrectResults.length > 0 && (
                        <button
                            onClick={onReviewOnlyErrors}
                            className="w-full sm:flex-1 group inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-heading font-bold text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 rounded-full border border-amber-500/30 hover:border-amber-400/50 shadow-lg active:scale-95 cursor-pointer"
                        >
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span>Revisar apenas erros</span>
                            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-heading font-semibold text-amber-300">
                                {incorrectResults.length}
                            </span>
                        </button>
                    )}
                    <button
                        onClick={onGoToAtlas}
                        className="w-full sm:flex-1 group inline-flex items-center justify-center gap-3 px-6 py-4 text-sm sm:text-base font-heading font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    >
                        <ArrowRight className="w-5 h-5 text-blue-200" />
                        <span>Ir para o Guia Atlas</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
