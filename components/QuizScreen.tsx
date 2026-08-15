'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Check, X, ArrowRight, Send } from 'lucide-react';
import { muscleData, Muscle } from '@/constants/muscleData';

// ── Normaliza texto para comparação: remove acentos, lowercase, trim ──
function normalize(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

// ── Remove a palavra "musculo" de qualquer posição do texto normalizado ──
function stripMusculo(text: string): string {
    return text
        .replace(/\bmusculo\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// ── Comparação flexível: aceita resposta completa ou sem prefixos ──
function flexMatch(userAnswer: string, correctAnswer: string): boolean {
    const a = normalize(userAnswer);
    const b = normalize(correctAnswer);

    // Match exato após normalização
    if (a === b) return true;

    // Match sem "musculo" (ex: "procero" ou "porcao superior do pterigoideo lateral")
    const aStripped = stripMusculo(a);
    const bStripped = stripMusculo(b);

    if (aStripped === bStripped) return true;

    // O aluno digitou o nome sem o prefixo
    if (a === bStripped) return true;

    // O aluno digitou com prefixo diferente mas o core é igual
    if (aStripped === b) return true;

    return false;
}

interface QuestionResult {
    muscleCorrect: boolean;
    accidentCorrect: boolean;
}

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
        setResults(prev => [...prev, { muscleCorrect: mCorrect, accidentCorrect: aCorrect }]);
    };

    const handleNext = () => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        if (isLastQuestion) {
            const finalResults = [...results];
            onFinish(finalResults);
            return;
        }
        setCurrentIndex(prev => prev + 1);
        setMuscleAnswer('');
        setAccidentAnswer('');
        setHasSubmitted(false);
        setMuscleCorrect(false);
        setAccidentCorrect(false);

        // Liberar transição após React processar o batch de state updates
        setTimeout(() => { isTransitioning.current = false; }, 100);
    };

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

    // ── Renderiza a imagem da questão ──
    const renderQuestionImage = (muscle: Muscle) => {
        if (muscle.displayMode === 'standard') {
            return (
                <div key={muscle.id} className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={muscle.baseImage || '/images/cranio-masseter-base.png'}
                        alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="block w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0 max-h-[35vh] sm:max-h-[45vh] text-transparent"
                    />
                    {muscle.highlightImage && (
                        <img
                            key={`highlight-${muscle.id}`}
                            src={muscle.highlightImage}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] pointer-events-none z-10 text-transparent"
                        />
                    )}
                </div>
            );
        }

        // Double mode: side by side
        return (
            <div key={muscle.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 w-full items-center">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-[0.6rem] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                        Músculo
                    </h3>
                    <div className="bg-slate-900/40 rounded-xl sm:rounded-2xl w-full flex items-center justify-center p-2 sm:p-4 border border-slate-800/80">
                        <img
                            src={muscle.image1}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="block w-full h-auto max-h-[22vh] sm:max-h-[35vh] object-contain text-transparent"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-[0.6rem] sm:text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/30">
                        Acidente
                    </h3>
                    <div className="bg-blue-950/20 rounded-xl sm:rounded-2xl w-full flex items-center justify-center p-2 sm:p-4 border border-blue-900/30">
                        <img
                            src={muscle.image2}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="block w-full h-auto max-h-[22vh] sm:max-h-[35vh] object-contain text-transparent"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-base sm:text-lg font-light tracking-tight text-slate-300">
                        Quiz <span className="font-semibold text-slate-100">Bucomaxilo</span>
                    </h1>
                    <span className="text-xs sm:text-sm text-slate-500 font-mono">
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
            <main className="flex-1 overflow-y-auto flex flex-col items-center p-3 sm:p-6 gap-4 sm:gap-6">
                {/* Image viewer */}
                <div className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex items-center justify-center transition-all duration-300">
                    {renderQuestionImage(currentQuestion)}
                </div>

                {/* Answer form */}
                <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
                    {/* Accident name input (pergunta primeiro) */}
                    <div className="relative">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 sm:mb-2">
                            Acidente Anatômico
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={accidentAnswer}
                                onChange={(e) => setAccidentAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={hasSubmitted}
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
                                <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full ${accidentCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
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
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 sm:mb-2">
                            Nome do Músculo
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={muscleAnswer}
                                onChange={(e) => setMuscleAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={hasSubmitted}
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
                                <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full ${muscleCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    {muscleCorrect
                                        ? <Check className="w-4 h-4 text-emerald-400" />
                                        : <X className="w-4 h-4 text-red-400" />
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="w-full max-w-2xl flex justify-center pb-4 sm:pb-6">
                    {!hasSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={muscleAnswer.trim() === '' || accidentAnswer.trim() === ''}
                            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 rounded-full shadow-lg hover:shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            <span>Responder</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 transition-all duration-300 rounded-full shadow-lg cursor-pointer"
                        >
                            <span>{isLastQuestion ? 'Ver Resultado' : 'Próxima Questão'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
