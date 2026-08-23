'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const QUIZ_COMPLETED_KEY = 'atlas:quiz-ever-completed';

interface CoverScreenProps {
  onStart: () => void;
  onGoToAtlas?: () => void;
  onContinueAtlas?: () => void;
  onViewLastResult?: () => void;
  hasSavedQuiz?: boolean;
}

export default function CoverScreen({
  onStart,
  onGoToAtlas,
  onContinueAtlas,
  onViewLastResult,
  hasSavedQuiz = false,
}: CoverScreenProps) {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [hasSavedAtlasPosition, setHasSavedAtlasPosition] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setHasCompletedQuiz(window.localStorage.getItem(QUIZ_COMPLETED_KEY) === 'true');
      setHasSavedAtlasPosition(Boolean(window.localStorage.getItem('atlas:last-muscle-id')));
    }, 0);

    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto py-6">

        {/* Cover Card — Title + Image unified */}
        <div className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group transition-all duration-300 hover:border-blue-500/30">

          {/* Title & Description inside the box */}
          <div className="px-5 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-5 space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-white leading-tight">
              Roteiro prático de crânio e suas estruturas associadas
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Músculos e acidentes anatômicos da região bucomaxilofacial para estudo e consulta acadêmica.
            </p>
          </div>

          {/* Divider */}
          <div className="mx-5 sm:mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Cover Image */}
          <div className="relative w-full p-3 sm:p-4">
            <img
              src="/images/capa.jpeg"
              alt="Capa do Atlas Bucomaxilofacial"
              className="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain mx-auto block rounded-xl sm:rounded-2xl transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Subtle gradient overlay on the image bottom */}
            <div className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 h-24 rounded-b-xl sm:rounded-b-2xl bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 sm:pt-4 flex flex-col items-center gap-3">
          {/* Primary — always goes to quiz */}
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-heading font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
            <span>Iniciar Avaliação</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary actions — only after quiz completion */}
          {(hasCompletedQuiz || hasSavedQuiz) && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {hasCompletedQuiz && onGoToAtlas && (
                <button
                  type="button"
                  onClick={onGoToAtlas}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2.5 text-sm font-heading font-semibold text-blue-300 transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/20 hover:text-blue-100 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  Ir para o Atlas
                </button>
              )}
              {hasSavedAtlasPosition && hasCompletedQuiz && onContinueAtlas && (
                <button
                  type="button"
                  onClick={onContinueAtlas}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-heading font-semibold text-slate-300 transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-200 active:scale-95"
                >
                  Continuar no Atlas
                </button>
              )}
              {hasSavedQuiz && onViewLastResult && (
                <button
                  type="button"
                  onClick={onViewLastResult}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-heading font-semibold text-slate-300 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
                >
                  Ver último resultado
                </button>
              )}
            </div>
          )}

          <span className="text-xs text-slate-500">
            {hasCompletedQuiz
              ? 'Refaça a avaliação ou acesse o atlas diretamente'
              : 'Complete a avaliação para desbloquear o atlas'}
          </span>
        </div>

      </div>
    </div>
  );
}
