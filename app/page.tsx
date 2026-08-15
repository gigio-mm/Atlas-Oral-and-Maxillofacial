'use client';

import { useState } from 'react';
import AnatomyViewer from '@/components/AnatomyViewer';
import CoverScreen from '@/components/CoverScreen';
import QuizScreen from '@/components/QuizScreen';
import QuizFeedback from '@/components/QuizFeedback';

type AppScreen = 'cover' | 'quiz' | 'feedback' | 'atlas';

interface QuestionResult {
  muscleCorrect: boolean;
  accidentCorrect: boolean;
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
      />
    );
  }

  return (
    <main>
      <AnatomyViewer onBackToCover={() => setScreen('cover')} />
    </main>
  );
}
