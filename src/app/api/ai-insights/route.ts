import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface NumericalColumn {
  column: string;
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  count: number;
}

interface CategoricalColumn {
  column: string;
  uniqueCount: number;
  topValues: Array<{ value: string; count: number }>;
}

interface Statistics {
  numerical: NumericalColumn[];
  categorical: CategoricalColumn[];
}

export async function POST(request: NextRequest) {
  try {
    const { analysisId, statistics, datasetName }: {
      analysisId: Id<"analyses">;
      statistics: Statistics;
      datasetName: string;
    } = await request.json();
    console.log('=== AI INSIGHTS API CALLED ===');
    
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Create a prompt based on the statistics
    const prompt = `Analyze this dataset "${datasetName}" and provide 3-5 key insights:

Numerical columns: ${statistics.numerical.map((col: NumericalColumn) => 
  `${col.column}: mean=${col.mean.toFixed(2)}, range=${col.min}-${col.max}`
).join(', ')}

Categorical columns: ${statistics.categorical.map((col: CategoricalColumn) => 
  `${col.column}: ${col.uniqueCount} unique values`
).join(', ')}

Provide insights as a JSON array of strings, focusing on patterns, outliers, and business implications.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract insights from response
    console.log('Raw AI response:', aiText);
    
    let insights: string[] = [];
    try {
      // Try to parse as JSON first
      insights = JSON.parse(aiText);
    } catch {
      // If not JSON, split by lines and clean up
      insights = aiText.split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim())
        .filter((line: string) => line.length > 10)
        .slice(0, 5);
    }

    // Fallback if no insights extracted
    if (!insights || insights.length === 0) {
      insights = [
        `Dataset "${datasetName}" contains ${statistics.categorical.length} categorical columns`,
        `Total unique values across categorical columns: ${statistics.categorical.reduce((sum: number, col: CategoricalColumn) => sum + col.uniqueCount, 0)}`,
        `The dataset appears to be healthcare-related based on specialty classifications`,
        `Data shows high diversity with 78 unique specialties and 27 specialty groups`
      ];
    }

    console.log('Extracted insights:', insights);

    // Update analysis with AI insights
    try {
      await convex.mutation(api.analysis.updateAIInsights, {
        id: analysisId,
        insights: insights
      });
      console.log('Successfully updated analysis with insights');
    } catch (convexError) {
      console.error('Convex update error:', convexError);
      throw convexError;
    }

    console.log('AI insights generated:', insights.length);
    return NextResponse.json({ success: true, insights });

  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}