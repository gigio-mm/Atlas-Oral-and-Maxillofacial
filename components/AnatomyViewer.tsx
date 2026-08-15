'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Info, Target, ChevronUp, ChevronDown, X, Home } from 'lucide-react';
import { muscleData, Muscle } from '@/constants/muscleData';

// ══════════════════════════════════════════════════════════════
// ── Hook: Preloader agressivo de imagens ──
// Força o download e cache de TODAS as imagens do muscleData
// em background, independente do estado de loading da UI.
// ══════════════════════════════════════════════════════════════
function useImagePreloader(muscles: Muscle[]) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // ── 1. Coletar TODAS as URLs de imagem (deduplicadas) ──
        const allUrls = muscles.flatMap((m) => {
            if (m.displayMode === 'standard') {
                return [m.baseImage, m.highlightImage];
            } else {
                return [m.image1, m.image2];
            }
        }).filter(Boolean) as string[];

        const uniqueUrls = [...new Set(allUrls)];

        if (uniqueUrls.length === 0) {
            setIsLoading(false);
            return;
        }

        // ── 2. Injetar <link rel="prefetch"> no <head> ──
        // Isso instrui o browser a baixar os assets com prioridade
        // baixa em background, antes mesmo do new Image().
        const linkElements: HTMLLinkElement[] = [];
        uniqueUrls.forEach((url) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
            linkElements.push(link);
        });

        // ── 3. Preload agressivo via new Image() ──
        // Dispara downloads imediatos e rastreia progresso.
        let loadedCount = 0;
        const totalImages = uniqueUrls.length;

        // Timeout de segurança: não bloquear a UI por mais de 5s
        const safetyTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        const onImageSettled = () => {
            loadedCount++;
            if (loadedCount >= totalImages) {
                setIsLoading(false);
                clearTimeout(safetyTimeout);
            }
        };

        // Manter referências para evitar garbage collection prematura
        const imageRefs: HTMLImageElement[] = [];

        uniqueUrls.forEach((src) => {
            const img = new window.Image();
            // Dica de prioridade alta para o browser
            if ('fetchPriority' in img) {
                (img as any).fetchPriority = 'high';
            }
            img.decoding = 'async';
            img.onload = onImageSettled;
            img.onerror = onImageSettled;
            img.src = src;
            imageRefs.push(img);
        });

        // Cleanup
        return () => {
            clearTimeout(safetyTimeout);
            // Remover os <link prefetch> do DOM
            linkElements.forEach((link) => {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });
        };
    }, [muscles]);

    return isLoading;
}

// ── Hook para detectar breakpoint ──
function useBreakpoint() {
    const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    useEffect(() => {
        function update() {
            const w = window.innerWidth;
            if (w <= 640) setBp('mobile');
            else if (w <= 1024) setBp('tablet');
            else setBp('desktop');
        }
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return bp;
}

interface AnatomyViewerProps {
    onBackToCover?: () => void;
}

export default function AnatomyViewer({ onBackToCover }: AnatomyViewerProps = {}) {
    const [activeMuscle, setActiveMuscle] = useState<Muscle | null>(null);
    const isLoading = useImagePreloader(muscleData);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const bp = useBreakpoint();

    const isMobile = bp === 'mobile';
    const isTablet = bp === 'tablet';
    const isDesktop = bp === 'desktop';

    // ── Travar/destravar scroll do body quando drawer abre/fecha ──
    useEffect(() => {
        if (isMobile && isDrawerOpen) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
        return () => document.body.classList.remove('drawer-open');
    }, [isMobile, isDrawerOpen]);

    // ── Selecionar músculo ──
    const handleSelectMuscle = useCallback((muscle: Muscle) => {
        setActiveMuscle(muscle);
        if (isMobile) {
            setIsDrawerOpen(false);
        }
    }, [isMobile]);

    // ── Renderização do Viewer de imagem ──
    const renderViewer = () => (
        <div className={`relative flex items-center justify-center w-full bg-white/5 backdrop-blur-3xl border border-white/10 transition-all duration-500 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] group
            ${isMobile
                ? 'rounded-2xl p-4 min-h-[280px] max-w-full'
                : isTablet
                    ? 'rounded-[2rem] p-6 min-h-[400px] max-w-3xl'
                    : 'rounded-[3rem] p-8 min-h-[500px] max-w-4xl shadow-2xl'
            }`}
        >
            {/* Modo Standard: Cranio Base + Highlight Overlays */}
            {(!activeMuscle || activeMuscle.displayMode === 'standard') && (
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={activeMuscle?.baseImage || '/images/cranio-masseter-base.png'}
                        alt=""
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className={`block w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] z-0 transition-opacity duration-500 text-transparent
                            ${isMobile ? 'max-h-[45vh]' : isTablet ? 'max-h-[55vh]' : 'max-h-[70vh]'}`}
                    />

                    {activeMuscle?.displayMode === 'standard' && activeMuscle.highlightImage && (
                        <img
                            key={activeMuscle.id}
                            src={activeMuscle.highlightImage}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-opacity duration-300 pointer-events-none z-10 text-transparent opacity-100"
                        />
                    )}
                </div>
            )}

            {/* Modo Double: Lado a Lado (ou empilhado em mobile) */}
            {activeMuscle?.displayMode === 'double' && (
                <div className={`gap-4 w-full h-full items-center animate-in fade-in zoom-in duration-500
                    ${isMobile
                        ? 'flex flex-col'
                        : 'grid grid-cols-2 gap-8'
                    }`}
                >
                    <div className={`flex flex-col items-center gap-3 w-full
                        ${isMobile ? '' : 'h-full justify-center'}`}
                    >
                        <h3 className={`font-semibold text-slate-300 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50 shadow-inner
                            ${isMobile ? 'text-[0.6rem]' : 'text-sm'}`}
                        >Músculo</h3>
                        <div className={`bg-slate-900/40 rounded-2xl w-full flex items-center justify-center border border-slate-800/80 shadow-2xl backdrop-blur-sm transition-transform hover:scale-105 duration-300
                            ${isMobile ? 'p-3 rounded-xl' : 'p-6 rounded-3xl flex-1'}`}
                        >
                            <img
                                src={activeMuscle.image1}
                                alt=""
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                className={`block w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] object-contain text-transparent
                                    ${isMobile ? 'max-h-[28vh]' : isTablet ? 'max-h-[40vh]' : 'max-h-[50vh]'}`}
                            />
                        </div>
                    </div>
                    <div className={`flex flex-col items-center gap-3 w-full
                        ${isMobile ? '' : 'h-full justify-center'}`}
                    >
                        <h3 className={`font-semibold text-blue-400 uppercase tracking-widest bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]
                            ${isMobile ? 'text-[0.6rem]' : 'text-sm'}`}
                        >Acidente</h3>
                        <div className={`bg-blue-950/20 w-full flex items-center justify-center border border-blue-900/30 shadow-[inset_0_0_30px_rgba(56,189,248,0.05)] transition-transform hover:scale-105 duration-300
                            ${isMobile ? 'p-3 rounded-xl' : 'p-6 rounded-3xl flex-1'}`}
                        >
                            <img
                                src={activeMuscle.image2}
                                alt=""
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                className={`block w-full h-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.3)] object-contain text-transparent
                                    ${isMobile ? 'max-h-[28vh]' : isTablet ? 'max-h-[40vh]' : 'max-h-[50vh]'}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // ── Lista de músculos (reutilizada em sidebar e drawer) ──
    const renderMuscleList = () => (
        <ul className="divide-y divide-slate-800/50">
            {muscleData.map((muscle) => (
                <li key={`list-${muscle.id}`}>
                    <button
                        onClick={() => handleSelectMuscle(muscle)}
                        onMouseEnter={isDesktop ? () => setActiveMuscle(muscle) : undefined}
                        // Comentado onMouseLeave: ao tirar o mouse do menu, a imagem permanece ativa 
                        // facilitando a leitura e a visão das imagens duplas.
                        className={`w-full text-left px-5 py-3.5 transition-all duration-300 group flex items-center justify-between
                            ${activeMuscle?.id === muscle.id
                                ? 'bg-blue-500/10 border-l-4 border-blue-500 shrink-0'
                                : 'hover:bg-slate-800/80 border-l-4 border-transparent shrink-0'
                            }
                            ${isMobile ? 'px-4 py-3' : ''}`}
                    >
                        <span className={`font-medium transition-colors line-clamp-2 pr-2
                            ${isMobile ? 'text-sm' : ''}
                            ${activeMuscle?.id === muscle.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}
                        >
                            {muscle.name}
                        </span>
                        <span className={`px-2 py-1 text-[0.6rem] uppercase font-bold tracking-widest rounded-md border shrink-0
                            ${muscle.displayMode === 'double'
                                ? 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                                : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                            }`}
                        >
                            {muscle.displayMode === 'double' ? 'Lado a Lado' : 'Base'}
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );

    // ── Info do músculo ativo ──
    const renderMuscleInfo = (compact = false) => {
        if (activeMuscle) {
            return (
                <div className={`animate-in fade-in slide-in-from-bottom-4 duration-300
                    ${compact ? '' : ''}`}
                >
                    <h2 className={`font-semibold text-slate-200 flex items-center gap-2
                        ${compact ? 'text-sm mb-2' : 'text-lg mb-4'}`}
                    >
                        {activeMuscle.name}
                    </h2>

                    <div className={`bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/50 transition-all hover:border-blue-500/30
                        ${compact ? 'p-4 rounded-xl' : 'p-6'}`}
                    >
                        <div className={`flex items-center gap-2 text-blue-500
                            ${compact ? 'mb-2' : 'mb-3'}`}
                        >
                            <Target className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                            <h3 className={`font-bold uppercase tracking-widest text-blue-500/80
                                ${compact ? 'text-[0.6rem]' : 'text-xs'}`}
                            >Acidente Anatômico</h3>
                        </div>
                        <h4 className={`font-semibold text-slate-100 leading-relaxed
                            ${compact ? 'text-sm' : 'text-md'}`}
                        >
                            {activeMuscle.anatomicalAccident.title}
                        </h4>
                    </div>
                </div>
            );
        }

        return (
            <div className={`flex flex-col items-center justify-center text-center text-slate-500 animate-in fade-in duration-300
                ${compact ? 'p-2' : 'p-4'}`}
            >
                <div className={`mb-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner
                    ${compact ? 'w-10 h-10' : 'w-16 h-16 mb-4'}`}
                >
                    <Info className={compact ? 'w-5 h-5 text-slate-600' : 'w-8 h-8 text-slate-600'} />
                </div>
                <p className={`font-medium text-slate-400 leading-relaxed
                    ${compact ? 'text-xs' : 'text-sm'}`}
                >
                    {isMobile
                        ? 'Toque em "Selecionar Músculo" para explorar.'
                        : isTablet
                            ? 'Toque em um músculo na lista para ver o acidente anatômico.'
                            : 'Passe o mouse sobre um músculo para ver o acidente anatômico associado.'}
                </p>
            </div>
        );
    };

    // ══════════════════════════════════════════════
    // ── MOBILE LAYOUT ──
    // ══════════════════════════════════════════════
    if (isMobile) {
        return (
            <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-200 font-sans overflow-hidden">
                {/* Loading */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-50 backdrop-blur-sm">
                        <span className="text-slate-400 animate-pulse font-medium tracking-widest text-sm">Carregando Anatomia...</span>
                    </div>
                )}

                {/* Header compacto */}
                <header className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between shrink-0 safe-area-top">
                    <div>
                        <h1 className="text-lg font-light tracking-tight text-slate-300">Atlas <span className="font-semibold text-slate-100">Bucomaxilo</span></h1>
                    </div>
                    {onBackToCover && (
                        <button
                            onClick={onBackToCover}
                            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 transition-colors"
                        >
                            <Home className="w-3.5 h-3.5 text-blue-400" />
                            <span>Capa</span>
                        </button>
                    )}
                </header>

                {/* Viewer — ocupa o espaço central */}
                <main className="flex-1 relative flex items-center justify-center p-3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 overflow-hidden min-h-0">
                    {renderViewer()}
                </main>

                {/* Card flutuante compacto de info */}
                <div className="shrink-0 px-3 py-2 bg-slate-950 border-t border-slate-800/50">
                    {renderMuscleInfo(true)}
                </div>

                {/* Botão para abrir drawer */}
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="shrink-0 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-t border-slate-800 text-slate-300 font-medium text-sm active:bg-slate-800 transition-colors safe-area-bottom"
                >
                    <ChevronUp className="w-4 h-4" />
                    Selecionar Músculo
                </button>

                {/* ── Bottom Drawer Overlay ── */}
                {isDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 z-40 backdrop-enter"
                            onClick={() => setIsDrawerOpen(false)}
                        />
                        {/* Drawer */}
                        <div
                            ref={drawerRef}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col drawer-enter safe-area-bottom border-t border-slate-700/50"
                        >
                            {/* Barra de arraste */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-1 bg-slate-600 rounded-full" />
                                    <span className="text-sm font-medium text-slate-400">Músculos</span>
                                </div>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-1 rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            {/* Lista scrollável */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
                                {renderMuscleList()}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ══════════════════════════════════════════════
    // ── TABLET LAYOUT ──
    // ══════════════════════════════════════════════
    if (isTablet) {
        return (
            <div className="flex flex-row h-[100dvh] bg-slate-950 text-slate-200 font-sans overflow-hidden">
                {/* Loading */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
                        <span className="text-slate-400 animate-pulse font-medium tracking-widest">Carregando Anatomia...</span>
                    </div>
                )}

                {/* Viewer central */}
                <main className="flex-1 relative flex items-center justify-center p-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 shadow-inner overflow-hidden">
                    {renderViewer()}
                </main>

                {/* Sidebar estreita para tablet */}
                <aside className="w-72 bg-slate-900 border-l border-slate-800/60 flex flex-col shadow-2xl z-20">
                    <header className="px-5 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-light tracking-tight text-slate-300">Atlas <span className="font-semibold text-slate-100">Bucomaxilo</span></h1>
                            <p className="text-xs text-slate-500 mt-1">Exploração Acadêmica</p>
                        </div>
                        {onBackToCover && (
                            <button
                                onClick={onBackToCover}
                                title="Voltar para a Capa"
                                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors"
                            >
                                <Home className="w-3.5 h-3.5 text-blue-400" />
                                <span>Capa</span>
                            </button>
                        )}
                    </header>

                    {/* Lista de músculos */}
                    <div className="flex-1 overflow-y-auto w-full border-b border-slate-800/50 custom-scrollbar">
                        {renderMuscleList()}
                    </div>

                    {/* Info do músculo */}
                    <div className="p-4 bg-slate-950 min-h-[30%] flex flex-col justify-center border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">
                        {renderMuscleInfo(false)}
                    </div>
                </aside>
            </div>
        );
    }

    // ══════════════════════════════════════════════
    // ── DESKTOP LAYOUT (original) ──
    // ══════════════════════════════════════════════
    return (
        <div className="flex flex-row h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

            {/* Container Centralizado para o Crânio */}
            <main className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 shadow-inner overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
                        <span className="text-slate-400 animate-pulse font-medium tracking-widest">Carregando Anatomia...</span>
                    </div>
                )}

                {renderViewer()}
            </main>

            {/* Painel Lateral Elegante (Dark Mode) */}
            <aside className="w-96 bg-slate-900 border-l border-slate-800/60 flex flex-col shadow-2xl z-20">
                <header className="px-6 py-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-light tracking-tight text-slate-300">Atlas <span className="font-semibold text-slate-100">Bucomaxilo</span></h1>
                        <p className="text-sm text-slate-500 mt-1">Exploração Acadêmica e Estrutural</p>
                    </div>
                    {onBackToCover && (
                        <button
                            onClick={onBackToCover}
                            title="Voltar para a Capa"
                            className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 transition-colors"
                        >
                            <Home className="w-4 h-4 text-blue-400" />
                            <span>Capa</span>
                        </button>
                    )}
                </header>

                {/* Lista de Músculos */}
                <div className="flex-1 overflow-y-auto w-full border-b border-slate-800/50 custom-scrollbar">
                    {renderMuscleList()}
                </div>

                {/* Informações do Músculo Selecionado ou Instrução */}
                <div className="p-6 bg-slate-950 min-h-[35%] flex flex-col justify-center border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">
                    {renderMuscleInfo(false)}
                </div>

            </aside>
        </div>
    );
}
