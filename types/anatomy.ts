export type DisplayMode = 'standard' | 'double';

export interface Muscle {
    id: string;
    name: string;
    displayMode: DisplayMode;
    baseImage?: string;
    highlightImage?: string;
    image1?: string;
    image2?: string;
    searchTerms?: string[];
    anatomicalAccident: {
        title: string;
    };
}

export interface QuestionResult {
    muscleCorrect: boolean;
    accidentCorrect: boolean;
    userMuscleAnswer: string;
    userAccidentAnswer: string;
    correctMuscleName: string;
    correctAccidentName: string;
    muscleId: string;
}

