'use client';

import React, { useState } from 'react';
import { Check, X, ArrowRight, ArrowLeft, BookOpen, ChevronLeft } from 'lucide-react';
import { muscleData, Muscle } from '@/constants/muscleData';

interface QuestionResult {
    muscleCorrect: boolean;
    accidentCorrect: boolean;
    userMuscleAnswer: string;
    userAccidentAnswer: string;
    correctMuscleName: string;
    correctAccidentName: string;
    muscleId: string;
}

interface QuizReviewProps {
    results: QuestionResult[];
    onGoToAtlas: () => void;
    onBackToFeedback: () => void;
}

export default function QuizReview({ results, onGoToAtlas, onBackToFeedback }: QuizReviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = results.length;
    const result = results[currentIndex];

    // Find the muscle data for the current question to render the image
    const muscle = muscleData.find(m => m.id === result.muscleId) || null;

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === total - 1;

    const handlePrev = () => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (!isLast) setCurrentIndex(prev => prev + 1);
    };

    // ── Renderiza a imagem da questão ──
    const renderQuestionImage = (m: Muscle) => {
        if (m.displayMode === 'standard') {
            return (
                <div key={m.id} className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={m.baseImage || '/images/cranio-masseter-base.png'}
                        alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="block w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0 max-h-[30vh] sm:max-h-[40vh] text-transparent"
                    />
                    {m.highlightImage && (
                        <img
                            key={`highlight-${m.id}`}
                            src={m.highlightImage}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] pointer-events-none z-10 text-transparent"
                        />
                    )}
                </div>
            );
        }

        // Double mode
        return (
            <div key={m.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 w-full items-center">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-[0.6rem] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                        Músculo
                    </h3>
                    <div className="bg-slate-900/40 rounded-xl sm:rounded-2xl w-full flex items-center justify-center p-2 sm:p-4 border border-slate-800/80">
                        <img
                            src={m.image1}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="block w-full h-auto max-h-[20vh] sm:max-h-[30vh] object-contain text-transparent"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-[0.6rem] sm:text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/30">
                        Acidente
                    </h3>
                    <div className="bg-blue-950/20 rounded-xl sm:rounded-2xl w-full flex items-center justify-center p-2 sm:p-4 border border-blue-900/30">
                        <img
                            src={m.image2}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="block w-full h-auto max-h-[20vh] sm:max-h-[30vh] object-contain text-transparent"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const bothCorrect = result.muscleCorrect && result.accidentCorrect;
    const noneCorrect = !result.muscleCorrect && !result.accidentCorrect;

    return (
        <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBackToFeedback}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Voltar ao Resultado"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-base sm:text-lg font-light tracking-tight text-slate-300">
                            Revisão <span className="font-semibold text-slate-100">da Prova</span>
                        </h1>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-500 font-mono">
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
                {/* Overall status badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider border
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
                    <div className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex items-center justify-center transition-all duration-300">
                        {renderQuestionImage(muscle)}
                    </div>
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
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
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
                                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
                                        Correta
                                    </span>
                                    <span className="text-sm sm:text-base font-semibold text-emerald-400">
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
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
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
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
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
                                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-600 mt-1 shrink-0 w-20">
                                        Correta
                                    </span>
                                    <span className="text-sm sm:text-base font-semibold text-emerald-400">
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
                        onClick={handlePrev}
                        disabled={isFirst}
                        className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300
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
                            onClick={onGoToAtlas}
                            className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 cursor-pointer"
                        >
                            <BookOpen className="w-4 h-4" />
                            Ir para o Atlas
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300 cursor-pointer"
                        >
                            Próxima
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
