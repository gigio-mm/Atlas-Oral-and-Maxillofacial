'use client';

import { useState } from 'react';
import AnatomyViewer from '@/components/AnatomyViewer';
import CoverScreen from '@/components/CoverScreen';
import QuizScreen from '@/components/QuizScreen';
import QuizFeedback from '@/components/QuizFeedback';
import QuizReview from '@/components/QuizReview';
import type { QuestionResult } from '@/types/anatomy';

type AppScreen = 'cover' | 'quiz' | 'feedback' | 'review' | 'atlas';

const LAST_QUIZ_RESULTS_KEY = 'atlas:last-quiz-results';
const QUIZ_COMPLETED_KEY = 'atlas:quiz-ever-completed';

function isQuestionResult(value: unknown): value is QuestionResult {
  if (!value || typeof value !== 'object') return false;

  const result = value as Partial<QuestionResult>;
  return typeof result.muscleCorrect === 'boolean'
    && typeof result.accidentCorrect === 'boolean'
    && typeof result.userMuscleAnswer === 'string'
    && typeof result.userAccidentAnswer === 'string'
    && typeof result.correctMuscleName === 'string'
    && typeof result.correctAccidentName === 'string'
    && typeof result.muscleId === 'string';
}

function readStoredQuizResults(): QuestionResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const storedValue = window.localStorage.getItem(LAST_QUIZ_RESULTS_KEY);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isQuestionResult) : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('cover');
  const [quizResults, setQuizResults] = useState<QuestionResult[]>(readStoredQuizResults);
  const [reviewOnlyErrors, setReviewOnlyErrors] = useState(false);

  if (screen === 'cover') {
    return (
      <CoverScreen
        onStart={() => setScreen('quiz')}
        onGoToAtlas={() => setScreen('atlas')}
        onContinueAtlas={() => setScreen('atlas')}
        onViewLastResult={() => setScreen('feedback')}
        hasSavedQuiz={quizResults.length > 0}
      />
    );
  }

  if (screen === 'quiz') {
    return (
      <QuizScreen
        onFinish={(results) => {
          setQuizResults(results);
          window.localStorage.setItem(LAST_QUIZ_RESULTS_KEY, JSON.stringify(results));
          window.localStorage.setItem(QUIZ_COMPLETED_KEY, 'true');
          setReviewOnlyErrors(false);
          setScreen('feedback');
        }}
      />
    );
  }

  if (screen === 'feedback') {
    return (
      <QuizFeedback
        results={quizResults}
        onGoToAtlas={() => setScreen('atlas')}
        onReview={() => {
          setReviewOnlyErrors(false);
          setScreen('review');
        }}
        onReviewOnlyErrors={() => {
          setReviewOnlyErrors(true);
          setScreen('review');
        }}
      />
    );
  }

  if (screen === 'review') {
    return (
      <QuizReview
        results={quizResults}
        initialOnlyErrors={reviewOnlyErrors}
        onGoToAtlas={() => setScreen('atlas')}
        onBackToFeedback={() => setScreen('feedback')}
      />
    );
  }

  return (
    <main>
      <AnatomyViewer onBackToCover={() => setScreen('cover')} />
    </main>
  );
}
