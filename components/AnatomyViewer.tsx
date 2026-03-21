'use client';

import React, { useState, useEffect } from 'react';
import { Info, MapPin, Target } from 'lucide-react';
import { muscleData, Muscle } from '@/constants/muscleData';

export default function AnatomyViewer() {
    const [activeMuscle, setActiveMuscle] = useState<Muscle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Lógica de pre-loading de imagens
    useEffect(() => {
        const imagesToPreload = muscleData.flatMap((m) => [m.baseImage, m.highlightImage]);

        let loadedCount = 0;

        imagesToPreload.forEach((src) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === imagesToPreload.length) {
                    setIsLoading(false);
                }
            };
            img.onerror = () => {
                // Ignora erros para não travar o app caso a imagem não exista ainda
                loadedCount++;
                if (loadedCount === imagesToPreload.length) {
                    setIsLoading(false);
                }
            };
        });
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

            {/* Container Centralizado para o Crânio */}
            <main className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 shadow-inner">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
                        <span className="text-slate-400 animate-pulse font-medium tracking-widest">Carregando Anatomia...</span>
                    </div>
                )}

                <div className="relative inline-block w-full max-w-2xl bg-white/5 rounded-[3rem] p-8 shadow-2xl backdrop-blur-3xl border border-white/10 transition-all duration-500 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] group">
                    {/* O container para as imagens com estilo premium (vidro fosco no fundo destacando possíveis pngs). */}
                    {muscleData.map((muscle) => {
                        const isActive = activeMuscle?.id === muscle.id;

                        return (
                            <div
                                key={muscle.id}
                                className="relative inline-block w-full"
                                onMouseEnter={() => setActiveMuscle(muscle)}
                                onMouseLeave={() => setActiveMuscle(null)}
                            >
                                {/* Imagem Base */}
                                <img
                                    src={muscle.baseImage}
                                    alt=""
                                    className="block w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0"
                                />

                                {/* Imagens de Destaque dos Músculos (Sobreposição controlada pelo hover) */}
                                <img
                                    src={muscle.highlightImage}
                                    alt=""
                                    className={`absolute top-0 left-0 w-full h-auto drop-shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-opacity duration-300 pointer-events-none z-10 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                />
                            </div>
                        )
                    })}
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
                                    onMouseLeave={() => setActiveMuscle(null)}
                                    className={`w-full text-left px-6 py-4 transition-all duration-300 group flex items-center justify-between
                                        ${activeMuscle?.id === muscle.id
                                            ? 'bg-red-500/10 border-l-4 border-red-500 shrink-0'
                                            : 'hover:bg-slate-800/80 border-l-4 border-transparent shrink-0'
                                        }`}
                                >
                                    <span className={`font-medium transition-colors ${activeMuscle?.id === muscle.id ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {muscle.name}
                                    </span>
                                    <Info className={`w-4 h-4 transition-colors ${activeMuscle?.id === muscle.id ? 'text-red-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Informações do Músculo Selecionado ou Instrução */}
                <div className="p-6 bg-slate-950 min-h-[40%] flex flex-col justify-center border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">
                    {activeMuscle ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                {activeMuscle.name}
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-red-500/30">
                                    <div className="flex items-center gap-2 text-red-500 mb-3">
                                        <Target className="w-5 h-5" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-500/80">Acidente Anatômico</h3>
                                    </div>
                                    <h4 className="text-md font-semibold text-slate-100">
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
