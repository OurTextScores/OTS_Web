'use client';

import dynamic from 'next/dynamic';

// Dynamically import ScoreEditor to avoid SSR issues with WASM/window
const ScoreEditor = dynamic(() => import('@/components/ScoreEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-xl text-gray-500">Loading Editor...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ScoreEditor />
    </main>
  );
}
