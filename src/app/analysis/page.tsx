// src/app/analysis/page.tsx
'use client';

import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Header from '@/components/Header';
import { api } from '../../../convex/_generated/api';

export default function AnalysisListPage() {
  const { user } = useUser();
  const datasets = useQuery(api.datasets.getUserDatasets, 
    user?.id ? { userId: user.id } : "skip"
  );

  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Analytics</h1>
        <div className="grid gap-4">
          {datasets?.map(dataset => (
            <Link 
              key={dataset._id} 
              href={`/analysis/${dataset._id}`}
              className="bg-[#1A2250] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-colors"
            >
              <h3 className="text-white font-semibold">{dataset.name}</h3>
              <p className="text-gray-400 text-sm">{dataset.rowCount} rows</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}