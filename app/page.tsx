'use client';

import { useState } from 'react';
import AnatomyViewer from '@/components/AnatomyViewer';
import CoverScreen from '@/components/CoverScreen';

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return <CoverScreen onStart={() => setHasStarted(true)} />;
  }

  return (
    <main>
      <AnatomyViewer onBackToCover={() => setHasStarted(false)} />
    </main>
  );
}

