'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
    	className="mb-10 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-md px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      ← Back
    </button>
  );
}
