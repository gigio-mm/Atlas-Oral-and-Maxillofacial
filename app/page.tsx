'use client';

import { useState } from 'react';
import AnatomyViewer from '@/components/AnatomyViewer';
import CoverScreen from '@/components/CoverScreen';
import QuizScreen from '@/components/QuizScreen';
import QuizFeedback from '@/components/QuizFeedback';
import QuizReview from '@/components/QuizReview';

type AppScreen = 'cover' | 'quiz' | 'feedback' | 'review' | 'atlas';

interface QuestionResult {
  muscleCorrect: boolean;
  accidentCorrect: boolean;
  userMuscleAnswer: string;
  userAccidentAnswer: string;
  correctMuscleName: string;
  correctAccidentName: string;
  muscleId: string;
}

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('cover');
  const [quizResults, setQuizResults] = useState<QuestionResult[]>([]);

  if (screen === 'cover') {
    return <CoverScreen onStart={() => setScreen('quiz')} />;
  }

  if (screen === 'quiz') {
    return (
      <QuizScreen
        onFinish={(results) => {
          setQuizResults(results);
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
        onReview={() => setScreen('review')}
      />
    );
  }

  if (screen === 'review') {
    return (
      <QuizReview
        results={quizResults}
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
