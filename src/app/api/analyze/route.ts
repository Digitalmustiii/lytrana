import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { datasetId, userId, csvData } = await request.json();
    console.log('=== ANALYSIS API CALLED ===');
    console.log('datasetId:', datasetId);
    console.log('userId:', userId);
    console.log('csvData length:', csvData?.length);

    if (!datasetId || !userId || !csvData) {
      console.error('Missing required fields:', { datasetId: !!datasetId, userId: !!userId, csvData: !!csvData });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse CSV data
    const rows = csvData.split('\n').filter((row: string) => row.trim());
    const headers = rows[0].split(',').map((h: string) => h.trim());
    const dataRows = rows.slice(1).map((row: string) => 
      row.split(',').map((cell: string) => cell.trim())
    );

    console.log('CSV parsed:', { headers, rowCount: dataRows.length });

    // Analyze columns
    const numerical: Array<{
      column: string;
      mean: number;
      median: number;
      std: number;
      min: number;
      max: number;
      count: number;
    }> = [];
    
    const categorical: Array<{
      column: string;
      uniqueCount: number;
      topValues: Array<{ value: string; count: number }>;
    }> = [];

    headers.forEach((header: string, colIndex: number) => {
      const values = dataRows.map((row: string[]) => row[colIndex]).filter((v: string) => v);
      const numericValues = values.map((v: string) => parseFloat(v)).filter((v: number) => !isNaN(v));
      
      if (numericValues.length > values.length * 0.8) {
        // Numerical column
        const sorted = numericValues.sort((a: number, b: number) => a - b);
        const mean = numericValues.reduce((a: number, b: number) => a + b, 0) / numericValues.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const variance = numericValues.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0) / numericValues.length;
        const std = Math.sqrt(variance);

        numerical.push({
          column: header,
          mean,
          median,
          std,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          count: numericValues.length
        });
      } else {
        // Categorical column
        const valueCounts: { [key: string]: number } = {};
        values.forEach((value: string) => {
          valueCounts[value] = (valueCounts[value] || 0) + 1;
        });

        const topValues = Object.entries(valueCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([value, count]) => ({ value, count: count as number }));

        categorical.push({
          column: header,
          uniqueCount: Object.keys(valueCounts).length,
          topValues
        });
      }
    });

    console.log('Statistics calculated:', { 
      numericalCount: numerical.length, 
      categoricalCount: categorical.length 
    });

    // Create analysis in Convex
    const analysisId = await convex.mutation(api.analysis.createAnalysis, {
      datasetId,
      userId,
      statistics: { numerical, categorical }
    });

    console.log('Analysis created with ID:', analysisId);

    // Get dataset info for AI insights
    let dataset;
    try {
      dataset = await convex.query(api.datasets.getDataset, { id: datasetId });
      console.log('Dataset fetched:', dataset?.name);
    } catch (error) {
      console.error('Failed to fetch dataset:', error);
    }

    // Call AI insights async (don't wait)
    const aiInsightsUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai-insights`;
    const aiPayload = {
      analysisId,
      statistics: { numerical, categorical },
      datasetName: dataset?.name || 'Dataset'
    };
    
    fetch(aiInsightsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aiPayload)
    }).catch(error => console.error('AI insights error:', error));

    console.log('=== ANALYSIS API COMPLETED ===');

    return NextResponse.json({
      success: true,
      analysisId,
      statistics: { numerical, categorical }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}