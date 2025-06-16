import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface DatasetColumn {
  name: string;
  type: string;
  nullable?: boolean;
}

interface Dataset {
  _id: string;
  name: string;
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  uploadedBy: string;
  uploadedAt: number;
  status: 'processing' | 'ready' | 'error';
  fileUrl?: string;
  columns: DatasetColumn[];
}

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
  console.log('🔍 Analysis API called');
  
  try {
    const { datasetId, userId, csvData } = await request.json();
    
    if (!datasetId || !userId || !csvData) {
      console.error('Missing required fields:', { datasetId: !!datasetId, userId: !!userId, csvData: !!csvData });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('📊 Starting analysis for dataset:', datasetId);
    console.log('CSV data length:', csvData?.length);

    // Parse CSV data with better error handling
    const lines = csvData.split('\n').filter((line: string) => line.trim());
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have at least header and one data row' }, { status: 400 });
    }

    const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''));
    const dataRows = lines.slice(1);

    console.log('CSV parsed:', { headers, rowCount: dataRows.length });

    // Convert to structured data
    const data: Record<string, string | number>[] = dataRows.map((row: string) => {
      const cols = row.split(',').map((col: string) => col.trim().replace(/"/g, ''));
      const rowObj: Record<string, string | number> = {};
      headers.forEach((header: string, index: number) => {
        const cellValue = cols[index] || '';
        const numericValue = Number(cellValue);
        rowObj[header] = !isNaN(numericValue) && cellValue !== '' ? numericValue : cellValue;
      });
      return rowObj;
    });

    console.log('📈 Analyzing columns...');

    // Analyze numerical columns
    const numericalStats: ColumnAnalysis[] = [];
    const categoricalStats: CategoricalAnalysis[] = [];

    headers.forEach((header: string) => {
      const values = data.map((row: Record<string, string | number>) => row[header])
        .filter((val: string | number) => val !== null && val !== undefined && val !== '');
      
      // Check if column is mostly numeric
      const numericValues = values
        .filter((val: string | number) => typeof val === 'number' || !isNaN(Number(val)))
        .map((val: string | number) => Number(val));
      
      if (numericValues.length > values.length * 0.8 && numericValues.length > 0) {
        // Numerical analysis
        const sortedValues = numericValues.sort((a: number, b: number) => a - b);
        const mean = numericValues.reduce((sum: number, val: number) => sum + val, 0) / numericValues.length;
        const median = sortedValues[Math.floor(sortedValues.length / 2)];
        const variance = numericValues.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
        const std = Math.sqrt(variance);
        
        numericalStats.push({
          column: header,
          mean: Number(mean.toFixed(2)),
          median: Number(median.toFixed(2)),
          std: Number(std.toFixed(2)),
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          count: numericValues.length,
        });
      } else {
        // Categorical analysis
        const stringValues = values.map((val: string | number) => String(val));
        const valueCounts: Record<string, number> = {};
        stringValues.forEach((val: string) => {
          valueCounts[val] = (valueCounts[val] || 0) + 1;
        });
        
        const topValues = Object.entries(valueCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([value, count]) => ({ value, count }));
        
        categoricalStats.push({
          column: header,
          uniqueCount: Object.keys(valueCounts).length,
          topValues,
        });
      }
    });

    // Calculate correlations for numerical columns
    const correlations: CorrelationAnalysis[] = [];
    for (let i = 0; i < numericalStats.length; i++) {
      for (let j = i + 1; j < numericalStats.length; j++) {
        const col1 = numericalStats[i].column;
        const col2 = numericalStats[j].column;
        
        const values1 = data
          .map((row: Record<string, string | number>) => Number(row[col1]))
          .filter((val: number) => !isNaN(val));
        const values2 = data
          .map((row: Record<string, string | number>) => Number(row[col2]))
          .filter((val: number) => !isNaN(val));
        
        if (values1.length > 1 && values2.length > 1 && values1.length === values2.length) {
          const correlation = calculateCorrelation(values1, values2);
          if (!isNaN(correlation)) {
            correlations.push({
              column1: col1,
              column2: col2,
              correlation: Number(correlation.toFixed(3)),
            });
          }
        }
      }
    }

    console.log('Statistics calculated:', { 
      numericalCount: numericalStats.length, 
      categoricalCount: categoricalStats.length,
      correlationsCount: correlations.length
    });

    // Generate basic insights
    const basicInsights = generateBasicInsights(numericalStats, categoricalStats, correlations);

    // Create analysis in Convex
    const analysisId = await convex.mutation(api.analysis.createAnalysis, {
      datasetId,
      userId,
      statistics: {
        numerical: numericalStats,
        categorical: categoricalStats,
      },
      correlations: correlations.length > 0 ? correlations : undefined,
      aiInsights: basicInsights,
    });

    console.log('Analysis created with ID:', analysisId);

    // Get dataset info for enhanced AI insights
    let dataset: Dataset | null = null;
    try {
      const rawDataset = await convex.query(api.datasets.getDataset, { id: datasetId });
      if (rawDataset) {
        dataset = {
          _id: rawDataset._id,
          name: rawDataset.name,
          fileName: rawDataset.fileName,
          fileSize: rawDataset.fileSize,
          rowCount: rawDataset.rowCount,
          columnCount: rawDataset.columnCount,
          uploadedBy: rawDataset.uploadedBy,
          uploadedAt: rawDataset.uploadedAt,
          status: rawDataset.status,
          fileUrl: rawDataset.fileUrl,
          columns: rawDataset.columns,
        };
      }
      console.log('Dataset fetched:', dataset?.name);
    } catch (error) {
      console.error('Failed to fetch dataset:', error);
      dataset = null;
    }

    // Call AI insights async (don't wait) - Enhanced version
    const enhanceAIInsights = async () => {
      try {
        const aiInsightsUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://lytrana.vercel.app'}/api/ai-insights`;
        const aiPayload = {
          analysisId,
          statistics: { numerical: numericalStats, categorical: categoricalStats },
          correlations,
          datasetName: dataset?.name || 'Dataset',
          rowCount: dataRows.length,
          columnCount: headers.length,
        };
        
        const response = await fetch(aiInsightsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiPayload)
        });

        if (!response.ok) {
          console.error('AI insights API error:', response.status);
        }
      } catch (error) {
        console.error('AI insights error:', error);
      }
    };

    // Don't await this - let it run in background
    enhanceAIInsights();

    console.log('✅ Analysis completed successfully');

    return NextResponse.json({
      success: true,
      analysisId,
      analysis: {
        statistics: {
          numerical: numericalStats,
          categorical: categoricalStats,
        },
        correlations: correlations.length > 0 ? correlations : undefined,
        aiInsights: basicInsights,
      },
      message: 'Analysis completed successfully',
    });

  } catch (error) {
    console.error('💥 Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a: number, b: number) => a + b, 0);
  const sumY = y.reduce((a: number, b: number) => a + b, 0);
  const sumXY = x.reduce((sum: number, xi: number, i: number) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum: number, xi: number) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum: number, yi: number) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

function generateBasicInsights(
  numerical: ColumnAnalysis[],
  categorical: CategoricalAnalysis[],
  correlations: CorrelationAnalysis[]
): string[] {
  const insights: string[] = [];

  // Dataset overview
  insights.push(`Dataset contains ${numerical.length} numerical and ${categorical.length} categorical columns.`);

  // Numerical insights
  if (numerical.length > 0) {
    const highestMean = numerical.reduce((prev: ColumnAnalysis, current: ColumnAnalysis) => 
      prev.mean > current.mean ? prev : current
    );
    insights.push(`${highestMean.column} has the highest average value (${highestMean.mean}).`);
    
    const mostVariable = numerical.reduce((prev: ColumnAnalysis, current: ColumnAnalysis) => 
      prev.std > current.std ? prev : current
    );
    insights.push(`${mostVariable.column} shows the highest variability (std: ${mostVariable.std}).`);
    
    // Check for potential outliers
    const outlierColumns = numerical.filter((col: ColumnAnalysis) => col.std > col.mean * 0.5);
    if (outlierColumns.length > 0) {
      insights.push(`Potential outliers detected in: ${outlierColumns.map((col: ColumnAnalysis) => col.column).join(', ')}.`);
    }
  }

  // Categorical insights
  if (categorical.length > 0) {
    const mostDiverse = categorical.reduce((prev: CategoricalAnalysis, current: CategoricalAnalysis) => 
      prev.uniqueCount > current.uniqueCount ? prev : current
    );
    insights.push(`${mostDiverse.column} has the most unique values (${mostDiverse.uniqueCount}).`);
    
    // Check for categorical columns with high cardinality
    const highCardinalityColumns = categorical.filter((col: CategoricalAnalysis) => col.uniqueCount > 10);
    if (highCardinalityColumns.length > 0) {
      insights.push(`High cardinality detected in: ${highCardinalityColumns.map((col: CategoricalAnalysis) => col.column).join(', ')}.`);
    }
  }

  // Correlation insights
  if (correlations.length > 0) {
    const strongCorrelations = correlations.filter((corr: CorrelationAnalysis) => Math.abs(corr.correlation) > 0.7);
    if (strongCorrelations.length > 0) {
      const strongestCorr = strongCorrelations.reduce((prev: CorrelationAnalysis, current: CorrelationAnalysis) => 
        Math.abs(prev.correlation) > Math.abs(current.correlation) ? prev : current
      );
      const corrType = strongestCorr.correlation > 0 ? 'positive' : 'negative';
      insights.push(`Strong ${corrType} correlation found: ${strongestCorr.column1} and ${strongestCorr.column2} (${strongestCorr.correlation}).`);
    }
    
    // Moderate correlations
    const moderateCorrelations = correlations.filter((corr: CorrelationAnalysis) => 
      Math.abs(corr.correlation) > 0.4 && Math.abs(corr.correlation) <= 0.7
    );
    if (moderateCorrelations.length > 0) {
      insights.push(`${moderateCorrelations.length} moderate correlations detected, suggesting potential relationships between variables.`);
    }
  }

  // Data quality insights
  if (numerical.length > 0) {
    const zeroVarianceColumns = numerical.filter((col: ColumnAnalysis) => col.std === 0);
    if (zeroVarianceColumns.length > 0) {
      insights.push(`Constant values detected in: ${zeroVarianceColumns.map((col: ColumnAnalysis) => col.column).join(', ')}.`);
    }
  }

  return insights;
}