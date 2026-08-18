'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, useId } from 'react';
import { ChevronUp, X, Home, Search, ZoomIn, Filter } from 'lucide-react';
import { muscleData } from '@/constants/muscleData';
import type { Muscle, DisplayMode } from '@/types/anatomy';
import { getHighlightParts, getMuscleImageSources, muscleMatchesSearch } from '@/lib/anatomyUtils';
import MuscleInfoCard from '@/components/MuscleInfoCard';
import ImageModal from '@/components/ImageModal';
import AnatomyImageViewer from '@/components/AnatomyImageViewer';

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
        const allUrls = muscles.flatMap(getMuscleImageSources);

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
                img.fetchPriority = 'high';
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

type DisplayFilter = 'all' | DisplayMode;

const LAST_MUSCLE_KEY = 'atlas:last-muscle-id';

export default function AnatomyViewer({ onBackToCover }: AnatomyViewerProps = {}) {
    const [activeMuscle, setActiveMuscle] = useState<Muscle | null>(muscleData[0]);
    const isLoading = useImagePreloader(muscleData);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayFilter, setDisplayFilter] = useState<DisplayFilter>('all');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const muscleItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const bp = useBreakpoint();
    const searchInputId = useId();

    const isMobile = bp === 'mobile';
    const isTablet = bp === 'tablet';
    const isDesktop = bp === 'desktop';

    useEffect(() => {
        const savedMuscleId = window.localStorage.getItem(LAST_MUSCLE_KEY);
        const savedMuscle = muscleData.find((muscle) => muscle.id === savedMuscleId);
        if (!savedMuscle) return;

        const restoreTimer = window.setTimeout(() => setActiveMuscle(savedMuscle), 0);
        return () => window.clearTimeout(restoreTimer);
    }, []);

    useEffect(() => {
        if (activeMuscle) window.localStorage.setItem(LAST_MUSCLE_KEY, activeMuscle.id);
    }, [activeMuscle]);

    // ── Travar/destravar scroll do body quando drawer abre/fecha ──
    useEffect(() => {
        if (isMobile && isDrawerOpen) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
        return () => document.body.classList.remove('drawer-open');
    }, [isMobile, isDrawerOpen]);

    useEffect(() => {
        if (!isMobile || !isDrawerOpen) return;

        const previouslyFocused = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const focusTimer = window.setTimeout(() => {
            drawerRef.current?.querySelector<HTMLElement>('input, button')?.focus();
        }, 0);
        const handleDrawerKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setIsDrawerOpen(false);
                return;
            }

            if (event.key !== 'Tab' || !drawerRef.current) return;
            const focusableElements = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ));
            if (focusableElements.length === 0) return;
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        window.addEventListener('keydown', handleDrawerKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleDrawerKeyDown);
            previouslyFocused?.focus();
        };
    }, [isDrawerOpen, isMobile]);

    const filteredMuscles = useMemo(() => {
        return muscleData.filter((muscle) => (
            muscleMatchesSearch(muscle, searchQuery)
            && (displayFilter === 'all' || muscle.displayMode === displayFilter)
        ));
    }, [displayFilter, searchQuery]);

    const activeMuscleIndex = activeMuscle
        ? muscleData.findIndex((muscle) => muscle.id === activeMuscle.id)
        : -1;
    const hasNavigationFilter = Boolean(searchQuery.trim()) || displayFilter !== 'all';
    const navigationMuscles = hasNavigationFilter ? filteredMuscles : muscleData;
    const activeNavigationIndex = activeMuscle
        ? navigationMuscles.findIndex((muscle) => muscle.id === activeMuscle.id)
        : -1;
    const canNavigate = navigationMuscles.length > 0;
    const isPreviousDisabled = !canNavigate || activeNavigationIndex <= 0;
    const isNextDisabled = !canNavigate || activeNavigationIndex === navigationMuscles.length - 1;
    const progressLabel = activeMuscleIndex >= 0
        ? `Músculo ${activeMuscleIndex + 1} de ${muscleData.length}`
        : `Músculo — de ${muscleData.length}`;
    const progressPercent = activeMuscleIndex >= 0
        ? ((activeMuscleIndex + 1) / muscleData.length) * 100
        : 0;

    // ── Selecionar músculo ──
    const handleSelectMuscle = useCallback((muscle: Muscle) => {
        setActiveMuscle(muscle);
        if (isMobile) {
            setIsDrawerOpen(false);
        }
    }, [isMobile]);

    const handlePrevious = useCallback(() => {
        if (!canNavigate) return;

        const targetIndex = activeNavigationIndex < 0
            ? 0
            : Math.max(0, activeNavigationIndex - 1);
        const targetMuscle = navigationMuscles[targetIndex];
        if (targetMuscle) handleSelectMuscle(targetMuscle);
    }, [activeNavigationIndex, canNavigate, handleSelectMuscle, navigationMuscles]);

    const handleNext = useCallback(() => {
        if (!canNavigate) return;

        const targetIndex = activeNavigationIndex < 0
            ? 0
            : Math.min(navigationMuscles.length - 1, activeNavigationIndex + 1);
        const targetMuscle = navigationMuscles[targetIndex];
        if (targetMuscle) handleSelectMuscle(targetMuscle);
    }, [activeNavigationIndex, canNavigate, handleSelectMuscle, navigationMuscles]);

    // ── Atalhos do roteiro guiado ──
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping = target?.tagName === 'INPUT'
                || target?.tagName === 'TEXTAREA'
                || target?.tagName === 'SELECT'
                || target?.isContentEditable;

            if (isTyping || isImageModalOpen) return;

            if (event.key === 'ArrowLeft' && !isPreviousDisabled) {
                event.preventDefault();
                handlePrevious();
            }

            if (event.key === 'ArrowRight' && !isNextDisabled) {
                event.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrevious, isImageModalOpen, isNextDisabled, isPreviousDisabled]);

    // ── Manter o item ativo visível na lista ──
    useEffect(() => {
        if (!activeMuscle) return;

        muscleItemRefs.current[activeMuscle.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, [activeMuscle, displayFilter, searchQuery]);

    // ── Texto de dica contextual por breakpoint ──
    const contextHint = isMobile
        ? 'Toque em "Selecionar Músculo" para explorar.'
        : isTablet
            ? 'Toque em um músculo na lista para ver o acidente anatômico.'
            : 'Passe o mouse sobre um músculo para ver o acidente anatômico associado.';

    const renderSearchPanel = (compact = false) => (
        <div className={`${compact ? 'p-4' : 'px-5 pb-5 pt-4'} border-b border-slate-800/70 bg-slate-950/20`}>
            <label className="sr-only" htmlFor={searchInputId}>Buscar músculo ou acidente anatômico</label>
            <div className="group/search relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within/search:text-blue-400" />
                <input
                    id={searchInputId}
                    type="text"
                    role="searchbox"
                    aria-label="Buscar músculo ou acidente anatômico"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Buscar músculo..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/10"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Limpar busca"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition-all duration-300 hover:bg-white/10 hover:text-slate-200 active:scale-95"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                <span className="text-slate-500">Roteiro guiado</span>
                <span className="text-blue-300">{progressLabel}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5" aria-hidden="true">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5" role="group" aria-label="Filtrar visualização">
                {([
                    ['all', 'Todos'],
                    ['standard', 'Base'],
                    ['double', 'Lado a lado'],
                ] as const).map(([filter, label]) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setDisplayFilter(filter)}
                        aria-pressed={displayFilter === filter}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${displayFilter === filter
                            ? 'border-blue-400/40 bg-blue-500/15 text-blue-200'
                            : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                            }`}
                    >
                        {filter === 'all' && <Filter className="h-3 w-3" />}
                        {label}
                    </button>
                ))}
            </div>
            {(searchQuery || displayFilter !== 'all') && (
                <p className="mt-2 text-xs text-slate-500">
                    {filteredMuscles.length} {filteredMuscles.length === 1 ? 'resultado' : 'resultados'}
                </p>
            )}
        </div>
    );

    // ── Renderização do Viewer de imagem ──
    const renderViewer = () => (
        <button
            type="button"
            aria-label={activeMuscle ? `Ampliar imagens de ${activeMuscle.name}` : 'Imagem anatômica'}
            onClick={() => activeMuscle && setIsImageModalOpen(true)}
            className={`group/viewer relative flex w-full cursor-zoom-in items-center justify-center border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-3xl transition-all duration-500 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70
                ${isMobile
                    ? 'min-h-[280px] max-w-full rounded-2xl p-4'
                    : isTablet
                        ? 'min-h-[400px] max-w-3xl rounded-[2rem] p-6'
                        : 'min-h-[500px] max-w-4xl rounded-[3rem] p-8'
                }`}
        >
            <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-300 opacity-0 shadow-lg shadow-black/20 transition-all duration-300 group-hover/viewer:translate-y-0 group-hover/viewer:opacity-100 group-focus-visible/viewer:opacity-100 sm:right-6 sm:top-6">
                <ZoomIn className="h-3.5 w-3.5 text-blue-300" />
                <span className="hidden sm:inline">Ampliar</span>
            </div>

            <div key={activeMuscle?.id || 'empty'} className="atlas-image-transition w-full">
                <AnatomyImageViewer muscle={activeMuscle} variant="atlas" isMobile={isMobile} isTablet={isTablet} />
            </div>
        </button>
    );

    // ── Lista de músculos (reutilizada em sidebar e drawer) ──
    const renderMuscleList = () => (
        filteredMuscles.length > 0 ? (
            <ul className="divide-y divide-slate-800/50">
                {filteredMuscles.map((muscle) => (
                    <li
                        key={`list-${muscle.id}`}
                        ref={(node) => { muscleItemRefs.current[muscle.id] = node; }}
                    >
                    <button
                        type="button"
                        onClick={() => handleSelectMuscle(muscle)}
                        onMouseEnter={isDesktop ? () => setActiveMuscle(muscle) : undefined}
                        className={`group flex w-full items-center justify-between border-l-4 px-5 py-3.5 text-left transition-all duration-300 active:scale-[0.99]
                            ${activeMuscle?.id === muscle.id
                                ? 'shrink-0 border-blue-400 bg-white/10 shadow-[inset_0_0_20px_rgba(56,189,248,0.04)]'
                                : 'shrink-0 border-transparent hover:bg-white/5'
                            }
                            ${isMobile ? 'px-4 py-3' : ''}`}
                    >
                        <span className={`line-clamp-2 pr-2 font-sans font-medium transition-colors duration-300
                            ${isMobile ? 'text-sm' : ''}
                            ${activeMuscle?.id === muscle.id ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200'}`}
                        >
                            {getHighlightParts(muscle.name, searchQuery).map((part, index) => (
                                <React.Fragment key={`${muscle.id}-name-${index}`}>
                                    {part.match ? (
                                        <mark className="rounded bg-blue-400/20 px-0.5 text-inherit">{part.value}</mark>
                                    ) : part.value}
                                </React.Fragment>
                            ))}
                        </span>
                        <span className={`shrink-0 rounded-md border px-2 py-1 text-[0.6rem] font-bold uppercase tracking-widest transition-all duration-300
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
        ) : (
            <div className="px-5 py-10 text-center">
                <Search className="mx-auto mb-3 h-5 w-5 text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Nenhum músculo encontrado.</p>
                <p className="mt-1 text-xs text-slate-600">Tente outro termo de busca.</p>
            </div>
        )
    );

    const renderImageModal = () => (
        <ImageModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            muscle={activeMuscle}
        />
    );

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
                        <h1 className="text-lg font-heading tracking-tight text-slate-300">Atlas <span className="font-bold text-slate-100">Bucomaxilo</span></h1>
                    </div>
                    {onBackToCover && (
                        <button
                            onClick={onBackToCover}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 transition-all duration-300 hover:text-white active:scale-95"
                        >
                            <Home className="w-3.5 h-3.5 text-blue-400" />
                            <span>Capa</span>
                        </button>
                    )}
                </header>

                {/* Viewer — ocupa o espaço central */}
                <main className="flex-1 relative flex items-center justify-center p-3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 overflow-hidden min-h-0">
                    <div className="w-full max-w-lg mx-auto">
                        {renderViewer()}
                    </div>
                </main>

                {/* Card flutuante compacto de info */}
                <div className="shrink-0 px-3 py-2 bg-slate-950 border-t border-slate-800/50">
                    <MuscleInfoCard
                        muscle={activeMuscle}
                        compact={true}
                        contextHint={contextHint}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isPreviousDisabled={isPreviousDisabled}
                        isNextDisabled={isNextDisabled}
                    />
                </div>

                {/* Botão para abrir drawer */}
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="shrink-0 flex items-center justify-center gap-2 border-t border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-300 active:scale-[0.99] active:bg-slate-800 safe-area-bottom"
                >
                    <ChevronUp className="w-4 h-4" />
                    Selecionar Músculo
                </button>

                {/* ── Bottom Drawer Overlay ── */}
                {isDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <button
                            type="button"
                            aria-label="Fechar seletor de músculos"
                            className="fixed inset-0 bg-black/60 z-40 backdrop-enter"
                            onClick={() => setIsDrawerOpen(false)}
                        />
                        {/* Drawer */}
                        <div
                            ref={drawerRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Selecionar músculo"
                            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col drawer-enter safe-area-bottom border-t border-slate-700/50"
                        >
                            {/* Barra de arraste */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-1 bg-slate-600 rounded-full" />
                                    <span className="text-sm font-medium text-slate-400">Músculos</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsDrawerOpen(false)}
                                    aria-label="Fechar seletor de músculos"
                                    className="rounded-full p-2 transition-all duration-300 hover:bg-slate-800 active:scale-95"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            {renderSearchPanel(true)}
                            {/* Lista scrollável */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
                                {renderMuscleList()}
                            </div>
                        </div>
                    </>
                )}
                {renderImageModal()}
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
                            <h1 className="text-xl font-heading tracking-tight text-slate-300">Atlas <span className="font-bold text-slate-100">Bucomaxilo</span></h1>
                            <p className="text-xs text-slate-500 mt-1 font-sans">Exploração Acadêmica</p>
                        </div>
                        {onBackToCover && (
                            <button
                                onClick={onBackToCover}
                                title="Voltar para a Capa"
                                className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 transition-all duration-300 hover:bg-slate-700 hover:text-white active:scale-95"
                            >
                                <Home className="w-3.5 h-3.5 text-blue-400" />
                                <span>Capa</span>
                            </button>
                        )}
                    </header>

                    {renderSearchPanel(true)}

                    {/* Lista de músculos */}
                    <div className="flex-1 overflow-y-auto w-full border-b border-slate-800/50 custom-scrollbar">
                        {renderMuscleList()}
                    </div>

                    {/* Info do músculo */}
                    <div className="p-4 bg-slate-950 min-h-[30%] flex flex-col justify-center border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">
                        <MuscleInfoCard
                            muscle={activeMuscle}
                            compact={false}
                            contextHint={contextHint}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            isPreviousDisabled={isPreviousDisabled}
                            isNextDisabled={isNextDisabled}
                        />
                    </div>
                </aside>
                {renderImageModal()}
            </div>
        );
    }

    // ══════════════════════════════════════════════
    // ── DESKTOP LAYOUT ──
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
                        <h1 className="text-2xl font-heading tracking-tight text-slate-300">Atlas <span className="font-bold text-slate-100">Bucomaxilo</span></h1>
                        <p className="text-sm text-slate-500 mt-1 font-sans">Exploração Acadêmica e Estrutural</p>
                    </div>
                    {onBackToCover && (
                        <button
                            onClick={onBackToCover}
                            title="Voltar para a Capa"
                            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all duration-300 hover:bg-slate-700 hover:text-white active:scale-95"
                        >
                            <Home className="w-4 h-4 text-blue-400" />
                            <span>Capa</span>
                        </button>
                    )}
                </header>

                {renderSearchPanel()}

                {/* Lista de Músculos */}
                <div className="flex-1 overflow-y-auto w-full border-b border-slate-800/50 custom-scrollbar">
                    {renderMuscleList()}
                </div>

                {/* Informações do Músculo Selecionado ou Instrução */}
                <div className="p-6 bg-slate-950 min-h-[35%] flex flex-col justify-center border-t border-slate-900 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">
                    <MuscleInfoCard
                        muscle={activeMuscle}
                        compact={false}
                        contextHint={contextHint}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isPreviousDisabled={isPreviousDisabled}
                        isNextDisabled={isNextDisabled}
                    />
                </div>

            </aside>
            {renderImageModal()}
        </div>
    );
}
