'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Check, X, ArrowRight, Send, Target } from 'lucide-react';
import { muscleData } from '@/constants/muscleData';
import type { QuestionResult } from '@/types/anatomy';
import { flexMatch } from '@/lib/quizUtils';
import AnatomyImageViewer from './AnatomyImageViewer';
import ImageModal from './ImageModal';

interface QuizScreenProps {
    onFinish: (results: QuestionResult[]) => void;
}

export default function QuizScreen({ onFinish }: QuizScreenProps) {
    const questions = useMemo(() => [...muscleData], []);
    const total = questions.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [muscleAnswer, setMuscleAnswer] = useState('');
    const [accidentAnswer, setAccidentAnswer] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [muscleCorrect, setMuscleCorrect] = useState(false);
    const [accidentCorrect, setAccidentCorrect] = useState(false);
    const [results, setResults] = useState<QuestionResult[]>([]);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [animState, setAnimState] = useState<'idle' | 'exiting' | 'entering'>('idle');
    const isTransitioning = useRef(false);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === total - 1;
    const progress = ((currentIndex + (hasSubmitted ? 1 : 0)) / total) * 100;

    const handleSubmit = () => {
        if (hasSubmitted) return;
        if (muscleAnswer.trim() === '' || accidentAnswer.trim() === '') return;

        const mCorrect = flexMatch(muscleAnswer, currentQuestion.name);
        const aCorrect = flexMatch(accidentAnswer, currentQuestion.anatomicalAccident.title);

        setMuscleCorrect(mCorrect);
        setAccidentCorrect(aCorrect);
        setHasSubmitted(true);
        setResults(prev => [...prev, {
            muscleCorrect: mCorrect,
            accidentCorrect: aCorrect,
            userMuscleAnswer: muscleAnswer.trim(),
            userAccidentAnswer: accidentAnswer.trim(),
            correctMuscleName: currentQuestion.name,
            correctAccidentName: currentQuestion.anatomicalAccident.title,
            muscleId: currentQuestion.id,
        }]);
    };

    const TRANSITION_MS = 300;

    const handleNext = useCallback(() => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        if (isLastQuestion) {
            const finalResults = [...results];
            onFinish(finalResults);
            return;
        }

        // Phase 1: Exit — slide current question out to the left
        setAnimState('exiting');

        setTimeout(() => {
            // Update question data while invisible
            setCurrentIndex(prev => prev + 1);
            setMuscleAnswer('');
            setAccidentAnswer('');
            setHasSubmitted(false);
            setMuscleCorrect(false);
            setAccidentCorrect(false);

            // Phase 2: Position new question off-screen right (no transition)
            setAnimState('entering');

            // Phase 3: After a frame, transition to idle (slide in from right)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimState('idle');
                    isTransitioning.current = false;
                });
            });
        }, TRANSITION_MS);
    }, [isLastQuestion, results, onFinish]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.repeat) {
            e.preventDefault();
            if (!hasSubmitted) {
                handleSubmit();
            } else {
                handleNext();
            }
        }
    };

    return (
        <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-base sm:text-lg font-heading font-light tracking-tight text-slate-300">
                        Quiz <span className="font-semibold text-slate-100">Bucomaxilo</span>
                    </h1>
                    <span className="text-xs sm:text-sm font-heading font-medium tracking-wide text-slate-500">
                        {currentIndex + 1} / {total}
                    </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Main content — scrollable */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center p-3 sm:p-6 gap-4 sm:gap-6">
                <div
                    className={`w-full flex flex-col items-center gap-4 sm:gap-6 ${
                        animState === 'exiting'
                            ? 'transition-all duration-300 ease-in opacity-0 -translate-x-12'
                            : animState === 'entering'
                                ? 'opacity-0 translate-x-12'
                                : 'transition-all duration-300 ease-out opacity-100 translate-x-0'
                    }`}
                >
                {/* Image viewer */}
                <button
                    type="button"
                    className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col items-center justify-center transition-colors duration-300 hover:border-white/30 cursor-pointer relative group"
                    onClick={() => setIsZoomModalOpen(true)}
                    aria-label={`Ampliar imagens de ${currentQuestion.name}`}
                    title="Clique para ampliar"
                >
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[0.65rem] uppercase tracking-widest text-white/40 font-heading font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        <Target size={12} /> Clique para ampliar
                    </div>
                    <AnatomyImageViewer muscle={currentQuestion} variant="quiz" />
                </button>

                {/* Answer form */}
                <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
                    {/* Accident name input (pergunta primeiro) */}
                    <div className="relative">
                        <label htmlFor="quiz-accident-answer" className="block text-xs font-heading font-bold uppercase tracking-widest text-slate-500 mb-1.5 sm:mb-2">
                            Acidente Anatômico
                        </label>
                        <div className="relative">
                            <input
                                id="quiz-accident-answer"
                                type="text"
                                value={accidentAnswer}
                                onChange={(e) => setAccidentAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={hasSubmitted}
                                aria-invalid={hasSubmitted && !accidentCorrect}
                                placeholder="Digite o acidente anatômico..."
                                className={`w-full px-4 py-3 sm:py-3.5 rounded-xl bg-slate-900/80 border text-sm sm:text-base text-slate-100 placeholder-slate-600 outline-none transition-all duration-300 pr-12
                                    ${hasSubmitted
                                        ? accidentCorrect
                                            ? 'border-emerald-500/60 bg-emerald-950/20'
                                            : 'border-red-500/60 bg-red-950/20'
                                        : 'border-slate-700/60 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30'
                                    }
                                    ${hasSubmitted ? 'opacity-80 cursor-not-allowed' : ''}`}
                            />
                            {hasSubmitted && (
                                <div aria-hidden="true" className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full ${accidentCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    {accidentCorrect
                                        ? <Check className="w-4 h-4 text-emerald-400" />
                                        : <X className="w-4 h-4 text-red-400" />
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Muscle name input (pergunta depois) */}
                    <div className="relative">
                        <label htmlFor="quiz-muscle-answer" className="block text-xs font-heading font-bold uppercase tracking-widest text-slate-500 mb-1.5 sm:mb-2">
                            Nome do Músculo
                        </label>
                        <div className="relative">
                            <input
                                id="quiz-muscle-answer"
                                type="text"
                                value={muscleAnswer}
                                onChange={(e) => setMuscleAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={hasSubmitted}
                                aria-invalid={hasSubmitted && !muscleCorrect}
                                placeholder="Digite o nome do músculo..."
                                className={`w-full px-4 py-3 sm:py-3.5 rounded-xl bg-slate-900/80 border text-sm sm:text-base text-slate-100 placeholder-slate-600 outline-none transition-all duration-300 pr-12
                                    ${hasSubmitted
                                        ? muscleCorrect
                                            ? 'border-emerald-500/60 bg-emerald-950/20'
                                            : 'border-red-500/60 bg-red-950/20'
                                        : 'border-slate-700/60 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30'
                                    }
                                    ${hasSubmitted ? 'opacity-80 cursor-not-allowed' : ''}`}
                            />
                            {hasSubmitted && (
                                <div aria-hidden="true" className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full ${muscleCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    {muscleCorrect
                                        ? <Check className="w-4 h-4 text-emerald-400" />
                                        : <X className="w-4 h-4 text-red-400" />
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {hasSubmitted && (
                    <p role="status" aria-live="polite" className={`w-full max-w-2xl text-center text-sm font-heading font-semibold ${muscleCorrect && accidentCorrect
                        ? 'text-emerald-300'
                        : muscleCorrect || accidentCorrect
                            ? 'text-amber-300'
                            : 'text-red-300'
                        }`}>
                        {muscleCorrect && accidentCorrect
                            ? 'Resposta completa correta.'
                            : muscleCorrect
                                ? 'Músculo correto. Revise o acidente anatômico.'
                                : accidentCorrect
                                    ? 'Acidente anatômico correto. Revise o músculo.'
                                    : 'As duas respostas precisam de revisão.'}
                    </p>
                )}

                {/* Action buttons */}
                <div className="w-full max-w-2xl flex justify-center pb-4 sm:pb-6">
                    {!hasSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={muscleAnswer.trim() === '' || accidentAnswer.trim() === ''}
                            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-heading font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 rounded-full shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            <span>Responder</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-heading font-bold text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 transition-all duration-300 rounded-full shadow-lg active:scale-95 cursor-pointer"
                        >
                            <span>{isLastQuestion ? 'Ver Resultado' : 'Próxima Questão'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    )}
                </div>
                </div>
            </main>
            <ImageModal
                isOpen={isZoomModalOpen} 
                onClose={() => setIsZoomModalOpen(false)} 
                muscle={currentQuestion} 
            />
        </div>
    );
}
