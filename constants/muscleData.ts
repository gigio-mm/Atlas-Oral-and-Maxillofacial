export interface Muscle {
    id: string;
    name: string;
    baseImage: string;
    highlightImage: string;
    anatomicalAccident: {
        title: string;
    };
}

export const muscleData: Muscle[] = [
    {
        id: 'masseter',
        name: 'Músculo Masseter',
        baseImage: '/images/cranio-masseter-base.png',
        highlightImage: '/images/cranio-masseter-highlight.png',
        anatomicalAccident: {
            title: 'Borda inferior do Osso Zigomático',
        },
    },
];
