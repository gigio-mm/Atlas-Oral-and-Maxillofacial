export function normalizeAnswer(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\bporcao\b/g, 'parte');
}

function stripMusculo(text: string): string {
    return text
        .replace(/\bmusculo\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function flexMatch(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    if (normalizedUser === normalizedCorrect) return true;

    const userWithoutPrefix = stripMusculo(normalizedUser);
    const correctWithoutPrefix = stripMusculo(normalizedCorrect);

    if (userWithoutPrefix === correctWithoutPrefix) return true;
    if (normalizedUser === correctWithoutPrefix) return true;
    if (userWithoutPrefix === normalizedCorrect) return true;

    if (userWithoutPrefix.includes(' e ') && correctWithoutPrefix.includes(' e ')) {
        const userParts = userWithoutPrefix.split(' e ').map((part) => part.trim()).sort();
        const correctParts = correctWithoutPrefix.split(' e ').map((part) => part.trim()).sort();
        return userParts.length === correctParts.length
            && userParts.every((part, index) => part === correctParts[index]);
    }

    return false;
}

export function isQuestionIncorrect(result: {
    muscleCorrect: boolean;
    accidentCorrect: boolean;
}): boolean {
    return !result.muscleCorrect || !result.accidentCorrect;
}

