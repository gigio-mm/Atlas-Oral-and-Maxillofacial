import type { Muscle } from '@/types/anatomy';

export function normalizeSearchText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const searchAliases: Record<string, string[]> = {
    arco: ['arco', 'bordas', 'borda'],
    acidente: ['acidente', 'origem', 'insercao', 'insercoes'],
    buco: ['bucinador', 'bucomaxilo', 'bucomaxilofacial'],
    zigoma: ['zigomatico', 'zigomatica', 'zigomaticos', 'zigomaticas'],
    zigomatico: ['zigoma', 'zigomatico', 'zigomatica'],
    mandibula: ['mandibula', 'mandibular'],
    mandibular: ['mandibula', 'mandibular'],
    maxila: ['maxila', 'maxilar'],
    maxilar: ['maxila', 'maxilar'],
    pterigoide: ['pterigoide', 'pterigoideo', 'pterigoidea'],
    pterigoideo: ['pterigoide', 'pterigoideo', 'pterigoidea'],
    profundo: ['profundo', 'profunda'],
    profunda: ['profundo', 'profunda'],
    superior: ['superior', 'sup'],
    inferior: ['inferior', 'inf'],
};

export function getMuscleImageSources(muscle: Muscle): string[] {
    if (muscle.displayMode === 'standard') {
        return [muscle.baseImage || '/images/cranio-masseter-base.png', muscle.highlightImage]
            .filter((source): source is string => Boolean(source));
    }

    return [muscle.image1, muscle.image2]
        .filter((source): source is string => Boolean(source));
}

export function getMuscleSearchText(muscle: Muscle): string {
    return normalizeSearchText([
        'músculo acidente anatômico',
        muscle.name,
        muscle.anatomicalAccident.title,
        ...(muscle.searchTerms || []),
    ].join(' '));
}

export function muscleMatchesSearch(muscle: Muscle, query: string): boolean {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return true;

    const searchText = getMuscleSearchText(muscle);
    if (searchText.includes(normalizedQuery)) return true;

    return normalizedQuery.split(' ').every((token) => {
        const candidates = searchAliases[token] || [token];
        return candidates.some((candidate) => searchText.includes(candidate));
    });
}

export function getHighlightParts(text: string, query: string): Array<{ value: string; match: boolean }> {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [{ value: text, match: false }];

    const queryTokens = normalizedQuery.split(' ').filter(Boolean);
    const normalizedText = normalizeWithCharacterMap(text);
    const ranges: Array<[number, number]> = [];

    queryTokens.forEach((token) => {
        const start = normalizedText.value.indexOf(token);
        if (start < 0) return;

        const end = start + token.length - 1;
        const originalStart = normalizedText.originalIndexes[start];
        const originalEnd = normalizedText.originalIndexes[end];
        if (originalStart !== undefined && originalEnd !== undefined) {
            ranges.push([originalStart, originalEnd + 1]);
        }
    });

    if (ranges.length === 0) return [{ value: text, match: false }];

    const mergedRanges = ranges
        .sort((first, second) => first[0] - second[0])
        .reduce<Array<[number, number]>>((merged, range) => {
            const previous = merged[merged.length - 1];
            if (previous && range[0] <= previous[1]) {
                previous[1] = Math.max(previous[1], range[1]);
            } else {
                merged.push([...range]);
            }
            return merged;
        }, []);

    const parts: Array<{ value: string; match: boolean }> = [];
    let lastIndex = 0;
    mergedRanges.forEach(([start, end]) => {
        if (start > lastIndex) parts.push({ value: text.slice(lastIndex, start), match: false });
        parts.push({ value: text.slice(start, end), match: true });
        lastIndex = end;
    });
    if (lastIndex < text.length) parts.push({ value: text.slice(lastIndex), match: false });

    return parts;
}

function normalizeWithCharacterMap(value: string): { value: string; originalIndexes: number[] } {
    let normalizedValue = '';
    const originalIndexes: number[] = [];
    let previousWasSpace = false;

    for (let index = 0; index < value.length; index += 1) {
        const normalizedCharacter = value[index]
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('pt-BR');

        for (const character of normalizedCharacter) {
            const isWordCharacter = /[a-z0-9]/.test(character);
            if (isWordCharacter) {
                normalizedValue += character;
                originalIndexes.push(index);
                previousWasSpace = false;
            } else if (!previousWasSpace && normalizedValue.length > 0) {
                normalizedValue += ' ';
                originalIndexes.push(index);
                previousWasSpace = true;
            }
        }
    }

    if (previousWasSpace) {
        normalizedValue = normalizedValue.slice(0, -1);
        originalIndexes.pop();
    }

    return { value: normalizedValue, originalIndexes };
}
