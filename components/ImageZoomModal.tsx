import React from 'react';
import { X } from 'lucide-react';
import { Muscle } from '@/constants/muscleData';

interface ImageZoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    muscle: Muscle | null;
}

export default function ImageZoomModal({ isOpen, onClose, muscle }: ImageZoomModalProps) {
    if (!isOpen || !muscle) return null;

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300 p-4 sm:p-8"
            onClick={handleClose}
        >
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors z-[110]"
                title="Fechar ampliação"
            >
                <X size={24} />
            </button>

            <div 
                className="relative w-full h-full max-w-7xl flex items-center justify-center animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
            >
                {muscle.displayMode === 'standard' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={muscle.baseImage || '/images/cranio-masseter-base.png'}
                            alt=""
                            className="block w-full h-auto max-h-[85vh] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                        />
                        {muscle.highlightImage && (
                            <img
                                src={muscle.highlightImage}
                                alt=""
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[85vh] object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.5)] pointer-events-none"
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 w-full h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-3 w-full sm:w-1/2 h-[45%] sm:h-full justify-center relative">
                            <h3 className="font-semibold text-slate-300 uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 shadow-inner text-xs sm:text-sm">
                                Músculo
                            </h3>
                            <div className="bg-slate-900/60 rounded-3xl w-full flex items-center justify-center border border-slate-800/80 p-4 sm:p-8 h-full max-h-[80vh]">
                                <img
                                    src={muscle.image1!}
                                    alt=""
                                    className="block w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 w-full sm:w-1/2 h-[45%] sm:h-full justify-center relative">
                            <h3 className="font-semibold text-blue-400 uppercase tracking-widest bg-blue-900/40 px-4 py-2 rounded-full border border-blue-500/50 shadow-[0_0_15px_rgba(56,189,248,0.3)] text-xs sm:text-sm">
                                Acidente
                            </h3>
                            <div className="bg-blue-950/40 rounded-3xl w-full flex items-center justify-center border border-blue-900/50 p-4 sm:p-8 h-full max-h-[80vh]">
                                <img
                                    src={muscle.image2!}
                                    alt=""
                                    className="block w-full h-full object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
