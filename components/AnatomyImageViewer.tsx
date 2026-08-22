import type { SyntheticEvent } from 'react';
import type { Muscle } from '@/types/anatomy';

type ImageViewerVariant = 'atlas' | 'quiz' | 'review' | 'modal';

interface AnatomyImageViewerProps {
    muscle: Muscle | null;
    variant?: ImageViewerVariant;
    isMobile?: boolean;
    isTablet?: boolean;
}

const imageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none';
};

export default function AnatomyImageViewer({
    muscle,
    variant = 'atlas',
    isMobile = false,
    isTablet = false,
}: AnatomyImageViewerProps) {
    if (!muscle || muscle.displayMode === 'standard') {
        return (
            <div className="relative flex h-full w-full items-center justify-center">
                <img
                    src={muscle?.baseImage || '/images/cranio-masseter-base.png'}
                    alt={muscle ? `${muscle.name} — imagem base` : 'Crânio em vista anatômica'}
                    onError={imageError}
                    className={`z-0 block h-auto w-full object-contain text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.12)] ${getStandardImageHeight(variant, isMobile, isTablet)}`}
                />
                {muscle?.highlightImage && (
                    <img
                        src={muscle.highlightImage}
                        alt={`${muscle.name} — área destacada`}
                        onError={imageError}
                        className={`pointer-events-none absolute left-1/2 top-1/2 z-10 block h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.45)] ${getStandardImageHeight(variant, isMobile, isTablet)}`}
                    />
                )}
            </div>
        );
    }

    const isModal = variant === 'modal';
    const panelImageHeight = isModal
        ? 'max-h-[38vh] sm:max-h-[78vh]'
        : isMobile
            ? 'max-h-[28vh]'
            : isTablet
                ? 'max-h-[40vh]'
                : variant === 'review'
                    ? 'max-h-[30vh] sm:max-h-[40vh]'
                    : 'max-h-[35vh] sm:max-h-[45vh]';

    return (
        <div className={`grid w-full items-center ${isModal ? 'h-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:gap-12' : isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4 sm:gap-8'}`}>
            <ImagePanel
                label="Músculo"
                src={muscle.image1}
                alt={`${muscle.name} — músculo`}
                imageClassName={`${panelImageHeight} drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
                modal={isModal}
            />
            <ImagePanel
                label="Acidente"
                src={muscle.image2}
                alt={`${muscle.name} — acidente anatômico`}
                imageClassName={`${panelImageHeight} drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]`}
                accent
                modal={isModal}
            />
        </div>
    );
}

function getStandardImageHeight(variant: ImageViewerVariant, isMobile: boolean, isTablet: boolean): string {
    if (variant === 'modal') return 'max-h-[88vh]';
    if (variant === 'quiz') return 'max-h-[35vh] sm:max-h-[45vh]';
    if (variant === 'review') return 'max-h-[30vh] sm:max-h-[40vh]';
    if (isMobile) return 'max-h-[45vh]';
    if (isTablet) return 'max-h-[55vh]';
    return 'max-h-[70vh]';
}

interface ImagePanelProps {
    label: string;
    src?: string;
    alt: string;
    imageClassName: string;
    accent?: boolean;
    modal?: boolean;
}

function ImagePanel({ label, src, alt, imageClassName, accent = false, modal = false }: ImagePanelProps) {
    return (
        <section className={`flex min-h-0 w-full flex-col items-center gap-2 sm:gap-3 ${modal ? 'h-full justify-center' : ''}`}>
            <h2 className={`rounded-full border px-3 py-1 text-[0.6rem] font-heading font-semibold uppercase tracking-widest shadow-inner sm:text-xs ${accent
                ? 'border-blue-500/30 bg-blue-900/20 text-blue-400 shadow-[0_0_12px_rgba(56,189,248,0.16)]'
                : 'border-slate-700/70 bg-slate-900/60 text-slate-300'
                }`}>
                {label}
            </h2>
            <div className={`flex min-h-0 w-full flex-1 items-center justify-center border p-3 shadow-2xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${modal ? 'rounded-3xl p-4 sm:p-6' : 'rounded-2xl sm:rounded-3xl'} ${accent
                ? 'border-blue-900/40 bg-blue-950/25'
                : 'border-slate-800/80 bg-slate-900/45'
                }`}>
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        onError={imageError}
                        className={`block h-auto w-full object-contain text-transparent ${imageClassName}`}
                    />
                )}
            </div>
        </section>
    );
}
