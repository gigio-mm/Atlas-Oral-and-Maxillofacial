'use client';

import React, { useState, useEffect } from 'react';
import { Info, Target } from 'lucide-react';
import { muscleData, Muscle } from '@/constants/muscleData';

export default function AnatomyViewer() {
    const [activeMuscle, setActiveMuscle] = useState<Muscle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Lógica de pre-loading de imagens
    useEffect(() => {
        const imagesToPreload = muscleData.flatMap((m) => {
            if (m.displayMode === 'standard') {
                return [m.baseImage, m.highlightImage];
            } else {
                return [m.image1, m.image2];
            }
        }).filter(Boolean) as string[];

        // Adiciona um timeout máximo para evitar break de Loading Screen
        const fallbackTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        let loadedCount = 0;
        if (imagesToPreload.length === 0) {
            setIsLoading(false);
            clearTimeout(fallbackTimeout);
            return;
        }

        const validImages = [...new Set(imagesToPreload)];

        validImages.forEach((src) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount >= validImages.length) {
                    setIsLoading(false);
                    clearTimeout(fallbackTimeout);
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount >= validImages.length) {
                    setIsLoading(false);
                    clearTimeout(fallbackTimeout);
                }
            };
        });

        return () => clearTimeout(fallbackTimeout);
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

            {/* Container Centralizado para o Crânio */}
            <main className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 shadow-inner overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
                        <span className="text-slate-400 animate-pulse font-medium tracking-widest">Carregando Anatomia...</span>
                    </div>
                )}

                <div className="relative flex items-center justify-center w-full max-w-4xl min-h-[500px] bg-white/5 rounded-[3rem] p-8 shadow-2xl backdrop-blur-3xl border border-white/10 transition-all duration-500 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] group">

                    {/* Modo Standard: Cranio Base + Highlight Overlays */}
                    {(!activeMuscle || activeMuscle.displayMode === 'standard') && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={activeMuscle?.baseImage || '/images/cranio-masseter-base.png'}
                                alt=""
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                className="block w-full h-auto max-h-[70vh] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0 transition-opacity duration-500 text-transparent"
                            />

                            {muscleData.filter(m => m.displayMode === 'standard').map((muscle) => {
                                const isActive = activeMuscle?.id === muscle.id;
                                return (
                                    <img
                                        key={muscle.id}
                                        src={muscle.highlightImage}
                                        alt=""
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-opacity duration-300 pointer-events-none z-10 text-transparent ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Modo Double: Lado a Lado */}
                    {activeMuscle?.displayMode === 'double' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full items-center animate-in fade-in zoom-in duration-500">
                            <div className="flex flex-col items-center gap-4 h-full justify-center w-full">
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest bg-slate-900/50 px-4 py-1 rounded-full border border-slate-700/50 shadow-inner">Músculo</h3>
                                <div className="bg-slate-900/40 rounded-3xl p-6 w-full flex-1 flex items-center justify-center border border-slate-800/80 shadow-2xl backdrop-blur-sm transition-transform hover:scale-105 duration-300">
                                    <img
                                        src={activeMuscle.image1}
                                        alt=""
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        className="block w-full h-auto max-h-[50vh] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] object-contain text-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 h-full justify-center w-full">
                                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest bg-blue-900/20 px-4 py-1 rounded-full border border-blue-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]">Acidente</h3>
                                <div className="bg-blue-950/20 rounded-3xl p-6 w-full flex-1 flex items-center justify-center border border-blue-900/30 shadow-[inset_0_0_30px_rgba(56,189,248,0.05)] transition-transform hover:scale-105 duration-300">
                                    <img
                                        src={activeMuscle.image2}
                                        alt=""
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        className="block w-full h-auto max-h-[50vh] drop-shadow-[0_0_20px_rgba(56,189,248,0.3)] object-contain text-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Painel Lateral Elegante (Dark Mode) */}
            <aside className="w-full md:w-96 bg-slate-900 border-l border-slate-800/60 flex flex-col shadow-2xl z-20">
                <header className="px-6 py-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
                    <h1 className="text-2xl font-light tracking-tight text-slate-300">Atlas <span className="font-semibold text-slate-100">Bucomaxilo</span></h1>
                    <p className="text-sm text-slate-500 mt-1">Exploração Acadêmica e Estrutural</p>
                </header>

                {/* Lista de Músculos */}
                <div className="flex-1 overflow-y-auto w-full border-b border-slate-800/50">
                    <ul className="divide-y divide-slate-800/50">
                        {muscleData.map((muscle) => (
                            <li key={`list-${muscle.id}`}>
                                <button
                                    onMouseEnter={() => setActiveMuscle(muscle)}
                                    // Comentado onMouseLeave: ao tirar o mouse do menu, a imagem permanece ativa 
                                    // facilitando a leitura e a visão das imagens duplas.
                                    className={`w-full text-left px-6 py-4 transition-all duration-300 group flex items-center justify-between
                                        ${activeMuscle?.id === muscle.id
                                            ? 'bg-blue-500/10 border-l-4 border-blue-500 shrink-0'
                                            : 'hover:bg-slate-800/80 border-l-4 border-transparent shrink-0'
                                        }`}
                                >
                                    <span className={`font-medium transition-colors line-clamp-2 pr-2 ${activeMuscle?.id === muscle.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {muscle.name}
                                    </span>
                                    <span className={`px-2 py-1 text-[0.6rem] uppercase font-bold tracking-widest rounded-md border shrink-0 ${muscle.displayMode === 'double' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                        }`}>
                                        {muscle.displayMode === 'double' ? 'Lado a Lado' : 'Base'}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Informações do Músculo Selecionado ou Instrução */}
                <div className="p-6 bg-slate-950 min-h-[35%] flex flex-col justify-center border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">
                    {activeMuscle ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                {activeMuscle.name}
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-blue-500/30">
                                    <div className="flex items-center gap-2 text-blue-500 mb-3">
                                        <Target className="w-5 h-5" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500/80">Acidente Anatômico</h3>
                                    </div>
                                    <h4 className="text-md font-semibold text-slate-100 leading-relaxed">
                                        {activeMuscle.anatomicalAccident.title}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 animate-in fade-in duration-300 p-4">
                            <div className="w-16 h-16 mb-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                                <Info className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                Passe o mouse sobre um músculo para ver o acidente anatômico associado.
                            </p>
                        </div>
                    )}
                </div>

            </aside>
        </div>
    );
}
