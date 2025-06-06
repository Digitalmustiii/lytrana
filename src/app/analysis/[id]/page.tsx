'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Database, Activity, Brain, RefreshCw, Save } from 'lucide-react';
import Header from '@/components/Header';
import CustomBarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import Histogram from '@/components/charts/Histogram';
import CorrelationHeatmap from '@/components/charts/CorrelationHeatmap';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function AnalysisPage() {
  const params = useParams();
  const { user } = useUser();
  const datasetId = params.id as Id<"datasets">;
  
  const dataset = useQuery(api.datasets.getDataset, { id: datasetId });
  const analysis = useQuery(api.analysis.getAnalysisByDataset, { datasetId });
  const createReport = useMutation(api.reports.createReport);

  if (!dataset || !analysis) {
    return (
      <div className="min-h-screen bg-[#161C40]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-[#2EF273]">Loading analysis...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSaveReport = async () => {
    if (!user?.id || !dataset || !analysis) return;
    
    try {
      await createReport({
        title: `${dataset.name} Analysis Report`,
        datasetId: dataset._id,
        analysisId: analysis._id,
        userId: user.id,
        content: {
          summary: `Analysis report for ${dataset.name} containing ${dataset.rowCount} rows and ${dataset.columnCount} columns.`,
          charts: [],
          insights: analysis.aiInsights || [],
        },
        isPublic: false,
      });
      alert('Report saved successfully!');
    } catch  {
      alert('Failed to save report');
    }
  };

  // Prepare correlation data for heatmap (mock data - replace with actual correlation calculation)
  const correlationData = analysis.statistics.numerical.length > 1 ? 
    analysis.statistics.numerical.flatMap((col1, i) =>
      analysis.statistics.numerical.map((col2, j) => ({
        x: col1.column,
        y: col2.column,
        value: i === j ? 1 : Math.random() * 2 - 1 // Mock correlation values
      }))
    ) : [];

  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{dataset.name} Analysis</h1>
            <p className="text-gray-300">Statistical insights and data visualization</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#2EF273] text-black rounded-lg hover:bg-[#25d063] transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Rows</p>
                <p className="text-2xl font-bold text-white">{dataset.rowCount}</p>
              </div>
              <Database className="h-8 w-8 text-[#2EF273]" />
            </div>
          </div>
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Columns</p>
                <p className="text-2xl font-bold text-white">{dataset.columnCount}</p>
              </div>
              <Activity className="h-8 w-8 text-[#2EF273]" />
            </div>
          </div>
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">File Size</p>
              <p className="text-2xl font-bold text-white">{(dataset.fileSize / 1024).toFixed(1)}KB</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#2EF273]" />
            </div>
          </div>
        </div>

        {/* Numerical Statistics */}
        {analysis.statistics.numerical.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Numerical Columns</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left text-gray-400 py-2">Column</th>
                    <th className="text-right text-gray-400 py-2">Mean</th>
                    <th className="text-right text-gray-400 py-2">Median</th>
                    <th className="text-right text-gray-400 py-2">Std Dev</th>
                    <th className="text-right text-gray-400 py-2">Min</th>
                    <th className="text-right text-gray-400 py-2">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.statistics.numerical.map((col, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-3 text-white font-medium">{col.column}</td>
                      <td className="py-3 text-right text-gray-300">{col.mean.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-300">{col.median.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-300">{col.std.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-300">{col.min}</td>
                      <td className="py-3 text-right text-gray-300">{col.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data Visualizations for Numerical Columns */}
        {analysis.statistics.numerical.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Statistical Visualizations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.statistics.numerical.slice(0, 4).map((col, i) => (
                <CustomBarChart
                  key={i}
                  data={[
                    { name: 'Min', value: col.min },
                    { name: 'Mean', value: col.mean },
                    { name: 'Median', value: col.median },
                    { name: 'Max', value: col.max }
                  ]}
                  title={`${col.column} Distribution`}
                  height={250}
                  colors={['#2EF273', '#00D4FF', '#FF6B6B', '#FFD93D']}
                />
              ))}
            </div>
          </div>
        )}

        {/* Correlation Heatmap */}
        {analysis.statistics.numerical.length > 1 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Correlation Matrix</h2>
            <CorrelationHeatmap
              data={correlationData}
              title="Variable Correlations"
              height={400}
            />
          </div>
        )}

        {/* Trend Analysis */}
        {analysis.statistics.numerical.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Trend Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.statistics.numerical.slice(0, 2).map((col, i) => (
                <LineChart
                  key={i}
                  data={[
                    { name: 'Q1', value: col.min },
                    { name: 'Q2', value: col.median },
                    { name: 'Q3', value: col.mean },
                    { name: 'Q4', value: col.max }
                  ]}
                  title={`${col.column} Trend`}
                  height={250}
                  color={i === 0 ? '#2EF273' : '#00D4FF'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Distribution Histograms */}
        {analysis.statistics.numerical.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Distribution Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.statistics.numerical.slice(0, 2).map((col, i) => {
                // Generate histogram data - fixed to match Histogram component interface
                const histogramData = [
                  { name: `${col.min}-${((col.min + col.mean) / 2).toFixed(1)}`, value: Math.floor(dataset.rowCount * 0.2) },
                  { name: `${((col.min + col.mean) / 2).toFixed(1)}-${col.mean.toFixed(1)}`, value: Math.floor(dataset.rowCount * 0.3) },
                  { name: `${col.mean.toFixed(1)}-${((col.mean + col.max) / 2).toFixed(1)}`, value: Math.floor(dataset.rowCount * 0.3) },
                  { name: `${((col.mean + col.max) / 2).toFixed(1)}-${col.max}`, value: Math.floor(dataset.rowCount * 0.2) }
                ];
                
                return (
                  <Histogram
                    key={i}
                    data={histogramData}
                    title={`${col.column} Distribution`}
                    height={250}
                    color={i === 0 ? '#A78BFA' : '#F472B6'}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Categorical Statistics */}
        {analysis.statistics.categorical.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Categorical Columns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.statistics.categorical.map((col, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-white font-medium">{col.column}</h3>
                  <p className="text-sm text-gray-400">{col.uniqueCount} unique values</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={col.topValues.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="value" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1A2250', 
                            border: '1px solid #4B5563',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Bar dataKey="count" fill="#2EF273" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-[#2EF273]" />
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          </div>
          
          {analysis.aiInsights && analysis.aiInsights.length > 0 ? (
            <div className="space-y-3">
              {analysis.aiInsights.map((insight, i) => (
                <div key={i} className="bg-[#161C40] p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse text-[#2EF273] mb-2">
                Generating AI insights...
              </div>
              <p className="text-gray-400 text-sm">
                This may take a few moments. Try refreshing the page if insights don&apos;t appear.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}