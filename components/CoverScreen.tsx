'use client';

import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface CoverScreenProps {
  onStart: () => void;
}

export default function CoverScreen({ onStart }: CoverScreenProps) {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto py-6">
        
        {/* Tag / Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-[0_0_20px_rgba(56,189,248,0.15)]">
          <BookOpen className="w-4 h-4" />
          <span>Atlas Bucomaxilofacial</span>
        </div>

        {/* Main Title & Description */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Guia Interativo de Anatomia
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed px-2">
            Músculos e acidentes anatômicos da região bucomaxilofacial para estudo e consulta acadêmica.
          </p>
        </div>

        {/* Cover Image Box */}
        <div className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group transition-all duration-300 hover:border-blue-500/30">
          <div className="relative w-full p-2 sm:p-4 bg-slate-900/40">
            <img
              src="/images/capa.jpeg"
              alt="Capa do Atlas Bucomaxilofacial"
              className="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain mx-auto block rounded-xl sm:rounded-2xl transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* Action Button Below Image */}
        <div className="pt-2 sm:pt-4 flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
            <span>Iniciar</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <span className="text-xs text-slate-500">Clique para iniciar a exploração interativa</span>
        </div>

      </div>
    </div>
  );
}
