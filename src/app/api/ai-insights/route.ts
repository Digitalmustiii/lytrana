import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { GoogleGenerativeAI } from '@google/generative-ai';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

interface ColumnAnalysis {
  column: string;
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  count: number;
}

interface CategoricalAnalysis {
  column: string;
  uniqueCount: number;
  topValues: { value: string; count: number; }[];
}

interface CorrelationAnalysis {
  column1: string;
  column2: string;
  correlation: number;
}

export async function POST(request: NextRequest) {
  console.log('🧠 AI Insights API called');
  
  try {
    const {
      analysisId,
      statistics,
      correlations,
      datasetName,
      rowCount,
      columnCount
    } = await request.json();

    if (!analysisId || !statistics) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('🤖 Generating AI insights for analysis:', analysisId);

    // Prepare data summary for AI analysis
    const dataSummary = prepareDataSummary(statistics, correlations, datasetName, rowCount, columnCount);
    
    // Generate AI insights using Google Gemini
    const aiInsights = await generateAIInsights(dataSummary);
    
    if (aiInsights.length > 0) {
      // Update the analysis with AI insights
      await convex.mutation(api.analysis.updateAIInsights, {
        id: analysisId,
        insights: aiInsights
      });

      console.log('✅ AI insights generated and saved:', aiInsights.length);
    }

    return NextResponse.json({
      success: true,
      insights: aiInsights,
      message: 'AI insights generated successfully'
    });

  } catch (error) {
    console.error('💥 AI Insights error:', error);
    return NextResponse.json(
      {
        error: 'AI insights generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function prepareDataSummary(
  statistics: { numerical: ColumnAnalysis[], categorical: CategoricalAnalysis[] },
  correlations: CorrelationAnalysis[] | undefined,
  datasetName: string,
  rowCount: number,
  columnCount: number
): string {
  let summary = `Dataset Analysis Summary for "${datasetName}":\n\n`;
  summary += `Dataset Overview:\n`;
  summary += `- Total rows: ${rowCount}\n`;
  summary += `- Total columns: ${columnCount}\n`;
  summary += `- Numerical columns: ${statistics.numerical.length}\n`;
  summary += `- Categorical columns: ${statistics.categorical.length}\n\n`;

  if (statistics.numerical.length > 0) {
    summary += `Numerical Columns Analysis:\n`;
    statistics.numerical.forEach((col: ColumnAnalysis) => {
      summary += `- ${col.column}: mean=${col.mean}, std=${col.std}, range=[${col.min}, ${col.max}]\n`;
    });
    summary += `\n`;
  }

  if (statistics.categorical.length > 0) {
    summary += `Categorical Columns Analysis:\n`;
    statistics.categorical.forEach((col: CategoricalAnalysis) => {
      const topValue = col.topValues[0];
      summary += `- ${col.column}: ${col.uniqueCount} unique values, most frequent: "${topValue.value}" (${topValue.count} times)\n`;
    });
    summary += `\n`;
  }

  if (correlations && correlations.length > 0) {
    summary += `Correlations Found:\n`;
    correlations
      .filter((corr: CorrelationAnalysis) => Math.abs(corr.correlation) > 0.3)
      .slice(0, 5)
      .forEach((corr: CorrelationAnalysis) => {
        summary += `- ${corr.column1} ↔ ${corr.column2}: ${corr.correlation}\n`;
      });
  }

  return summary;
}

async function generateAIInsights(dataSummary: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
As a data analyst, analyze the following dataset summary and provide 5-7 key insights about the data. 
Focus on:
1. Data quality observations
2. Interesting patterns or trends
3. Potential business implications
4. Statistical significance of findings
5. Recommendations for further analysis
6. Data anomalies or outliers
7. Relationships between variables

Dataset Summary:
${dataSummary}

Please provide insights as separate bullet points, each being 1-2 sentences long. Be specific and actionable.
Do not include generic statements. Focus on the actual data characteristics shown.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into individual insights
    const insights = text
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .filter((line: string) => line.includes('•') || line.includes('-') || line.includes('*') || /^\d+\./.test(line.trim()))
      .map((line: string) => line.replace(/^[\s•\-*\d\.]+/, '').trim())
      .filter((insight: string) => insight.length > 20)
      .slice(0, 8); // Limit to 8 insights max

    return insights.length > 0 ? insights : [
      'Dataset analysis completed successfully.',
      'Consider exploring relationships between numerical variables for deeper insights.',
      'Review categorical distributions for potential data quality issues.'
    ];

  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Fallback insights based on data summary
    return generateFallbackInsights(dataSummary);
  }
}

function generateFallbackInsights(dataSummary: string): string[] {
  const insights: string[] = [];
  
  // Extract basic information from summary
  const numericalMatch = dataSummary.match(/Numerical columns: (\d+)/);
  const categoricalMatch = dataSummary.match(/Categorical columns: (\d+)/);
  const rowsMatch = dataSummary.match(/Total rows: (\d+)/);
  
  const numericalCount = numericalMatch ? parseInt(numericalMatch[1]) : 0;
  const categoricalCount = categoricalMatch ? parseInt(categoricalMatch[1]) : 0;
  const totalRows = rowsMatch ? parseInt(rowsMatch[1]) : 0;
  
  if (totalRows > 0) {
    if (totalRows < 100) {
      insights.push('Small dataset detected - consider collecting more data for robust statistical analysis.');
    } else if (totalRows > 10000) {
      insights.push('Large dataset provides good statistical power for analysis and modeling.');
    }
  }
  
  if (numericalCount > categoricalCount) {
    insights.push('Dataset is predominantly numerical, suitable for statistical modeling and regression analysis.');
  } else if (categoricalCount > numericalCount) {
    insights.push('High proportion of categorical data suggests focus on classification or segmentation analysis.');
  }
  
  if (dataSummary.includes('correlation')) {
    insights.push('Correlations detected between variables - investigate for potential multicollinearity in modeling.');
  }
  
  insights.push('Data preprocessing may be needed before advanced analysis - check for missing values and outliers.');
  insights.push('Consider creating data visualizations to better understand variable distributions and relationships.');
  
  return insights;
}