'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, X, ArrowRight, ArrowLeft, BookOpen, ChevronLeft, Filter, ZoomIn } from 'lucide-react';
import { muscleData } from '@/constants/muscleData';
import type { QuestionResult } from '@/types/anatomy';
import { isQuestionIncorrect } from '@/lib/quizUtils';
import AnatomyImageViewer from './AnatomyImageViewer';
import ImageModal from './ImageModal';

interface QuizReviewProps {
    results: QuestionResult[];
    onGoToAtlas: () => void;
    onBackToFeedback: () => void;
    initialOnlyErrors?: boolean;
}

export default function QuizReview({ results, onGoToAtlas, onBackToFeedback, initialOnlyErrors = false }: QuizReviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOnlyErrors, setIsOnlyErrors] = useState(initialOnlyErrors);
    const reviewResults = isOnlyErrors
        ? results.filter(isQuestionIncorrect)
        : results;
    const total = reviewResults.length;
    const result = reviewResults[currentIndex];
    const errorCount = results.filter(isQuestionIncorrect).length;
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

    // Find the muscle data for the current question to render the image
    const muscle = result ? muscleData.find(m => m.id === result.muscleId) || null : null;

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === total - 1;

    const handlePrev = useCallback(() => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    }, [isFirst]);

    const handleNext = useCallback(() => {
        if (!isLast) setCurrentIndex(prev => prev + 1);
    }, [isLast]);

    const handleReviewModeChange = () => {
        setIsOnlyErrors(prev => !prev);
        setCurrentIndex(0);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isZoomModalOpen) return;
            if (event.key === 'ArrowLeft' && !isFirst) {
                event.preventDefault();
                handlePrev();
            }
            if (event.key === 'ArrowRight' && !isLast) {
                event.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, isZoomModalOpen]);

    if (!result) {
        return (
            <div className="flex min-h-[100dvh] w-full items-center justify-center bg-slate-950 p-6 text-slate-100">
                <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl shadow-black/40">
                    <p className="text-sm text-slate-400">Não há questões disponíveis para revisar.</p>
                    <button
                        type="button"
                        onClick={onBackToFeedback}
                        className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-heading font-semibold text-slate-200 transition-all hover:bg-white/10 active:scale-95"
                    >
                        Voltar ao resultado
                    </button>
                </div>
            </div>
        );
    }

    const bothCorrect = result.muscleCorrect && result.accidentCorrect;
    const noneCorrect = result && !result.muscleCorrect && !result.accidentCorrect;

    return (
        <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onBackToFeedback}
                            aria-label="Voltar ao resultado do Quiz"
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Voltar ao Resultado"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-base sm:text-lg font-heading font-light tracking-tight text-slate-300">
                            Revisão <span className="font-semibold text-slate-100">{isOnlyErrors ? 'apenas dos erros' : 'da Prova'}</span>
                        </h1>
                    </div>
                    <span className="text-xs sm:text-sm font-heading font-medium tracking-wide text-slate-500">
                        {currentIndex + 1} / {total}
                    </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                    />
                </div>
            </header>

            {/* Main content — scrollable */}
            <main className="flex-1 overflow-y-auto flex flex-col items-center p-3 sm:p-6 gap-4 sm:gap-6">
                {errorCount > 0 && (
                    <button
                        type="button"
                        onClick={handleReviewModeChange}
                        aria-pressed={isOnlyErrors}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-heading font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
                            isOnlyErrors
                                ? 'border-amber-400/50 bg-amber-400/15 text-amber-200'
                                : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:border-amber-500/40 hover:text-amber-200'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        {isOnlyErrors ? 'Mostrar todas as questões' : `Revisar apenas erros (${errorCount})`}
                    </button>
                )}

                {/* Overall status badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-bold uppercase tracking-wider border
                    ${bothCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : noneCorrect
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                >
                    {bothCorrect ? (
                        <><Check className="w-4 h-4" /> Questão correta</>
                    ) : noneCorrect ? (
                        <><X className="w-4 h-4" /> Questão errada</>
                    ) : (
                        <><Check className="w-4 h-4" /> Parcialmente correta</>
                    )}
                </div>

                {/* Image viewer */}
                {muscle && (
                    <button
                        type="button"
                        onClick={() => setIsZoomModalOpen(true)}
                        aria-label={`Ampliar imagens de ${muscle.name}`}
                        className="group/review-image relative flex w-full max-w-4xl cursor-zoom-in items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-3xl transition-all duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 sm:rounded-3xl sm:p-6"
                    >
                        <span className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-heading font-semibold text-slate-300 opacity-0 transition-opacity duration-300 group-hover/review-image:opacity-100">
                            <ZoomIn className="h-3.5 w-3.5 text-blue-300" />
                            Ampliar
                        </span>
                        <AnatomyImageViewer muscle={muscle} variant="review" />
                    </button>
                )}

                {/* Review cards */}
                <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
                    {/* Muscle answer review */}
                    <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                        result.muscleCorrect
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-red-500/5 border-red-500/30'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">
                                Nome do Músculo
                            </span>
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                result.muscleCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                            }`}>
                                {result.muscleCorrect
                                    ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    : <X className="w-3.5 h-3.5 text-red-400" />
                                }
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <span className="text-[0.65rem] font-heading font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
                                    Sua resp.
                                </span>
                                <span className={`text-sm sm:text-base font-medium ${
                                    result.muscleCorrect ? 'text-emerald-300' : 'text-red-300 line-through decoration-red-500/40'
                                }`}>
                                    {result.userMuscleAnswer}
                                </span>
                            </div>
                            {!result.muscleCorrect && (
                                <div className="flex items-start gap-3">
                                    <span className="text-[0.65rem] font-heading font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
                                        Correta
                                    </span>
                                    <span className="text-sm sm:text-base font-heading font-semibold text-emerald-400">
                                        {result.correctMuscleName}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Accident answer review */}
                    <div className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                        result.accidentCorrect
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-red-500/5 border-red-500/30'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">
                                Acidente Anatômico
                            </span>
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                result.accidentCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                            }`}>
                                {result.accidentCorrect
                                    ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    : <X className="w-3.5 h-3.5 text-red-400" />
                                }
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <span className="text-[0.65rem] font-heading font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
                                    Sua resp.
                                </span>
                                <span className={`text-sm sm:text-base font-medium ${
                                    result.accidentCorrect ? 'text-emerald-300' : 'text-red-300 line-through decoration-red-500/40'
                                }`}>
                                    {result.userAccidentAnswer}
                                </span>
                            </div>
                            {!result.accidentCorrect && (
                                <div className="flex items-start gap-3">
                                    <span className="text-[0.65rem] font-heading font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
                                        Correta
                                    </span>
                                    <span className="text-sm sm:text-base font-heading font-semibold text-emerald-400">
                                        {result.correctAccidentName}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="w-full max-w-2xl flex items-center justify-between pb-4 sm:pb-6">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={isFirst}
                        aria-label="Ir para a questão anterior"
                        className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300
                            ${isFirst
                                ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                    </button>

                    {isLast ? (
                        <button
                            type="button"
                            onClick={onGoToAtlas}
                            className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all duration-300 cursor-pointer"
                        >
                            <BookOpen className="w-4 h-4" />
                            Ir para o Atlas
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Ir para a próxima questão"
                            className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer"
                        >
                            Próxima
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    )}
                </div>
            </main>
            <ImageModal
                isOpen={isZoomModalOpen}
                onClose={() => setIsZoomModalOpen(false)}
                muscle={muscle}
            />
        </div>
    );
}
