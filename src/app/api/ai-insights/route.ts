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

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface RequestBody {
  analysisId: Id<"analyses">;
  statistics: Statistics;
  datasetName: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestBody: RequestBody = await request.json();
    const { analysisId, statistics, datasetName } = requestBody;
    
    console.log('=== AI INSIGHTS API CALLED ===');
    console.log('Analysis ID:', analysisId);
    console.log('Dataset Name:', datasetName);
    console.log('Statistics:', JSON.stringify(statistics, null, 2));
    
    // Check if API key exists
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }
    
    console.log('API Key exists:', !!process.env.GOOGLE_GEMINI_API_KEY);
    console.log('API Key length:', process.env.GOOGLE_GEMINI_API_KEY.length);

    // Create a more detailed prompt
    const prompt = `You are a data analyst. Analyze this dataset and provide exactly 4 key insights in JSON array format.

Dataset: "${datasetName}"

${statistics.numerical.length > 0 ? `
Numerical Columns:
${statistics.numerical.map((col: NumericalColumn) => 
  `- ${col.column}: mean=${col.mean.toFixed(2)}, median=${col.median.toFixed(2)}, std=${col.std.toFixed(2)}, range=${col.min}-${col.max}, count=${col.count}`
).join('\n')}
` : ''}

${statistics.categorical.length > 0 ? `
Categorical Columns:
${statistics.categorical.map((col: CategoricalColumn) => 
  `- ${col.column}: ${col.uniqueCount} unique values, top values: ${col.topValues.slice(0, 3).map(v => `${v.value}(${v.count})`).join(', ')}`
).join('\n')}
` : ''}

Respond with ONLY a JSON array of 4 strings, each containing one insight. Focus on:
1. Data distribution patterns
2. Notable statistics or outliers
3. Data quality observations
4. Business implications

Example format: ["Insight 1", "Insight 2", "Insight 3", "Insight 4"]`;

    console.log('Generated prompt:', prompt);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
    console.log('API URL (without key):', apiUrl.split('?key=')[0]);

    // Call Gemini API with better error handling
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'DataAnalysis/1.0'
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: { 
          temperature: 0.3,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API failed: ${response.status}`, errorText);
      
      // Return fallback insights with error info
      const fallbackInsights = [
        `Dataset "${datasetName}" contains ${statistics.numerical.length} numerical and ${statistics.categorical.length} categorical columns`,
        `Total data points analyzed across ${statistics.numerical.length + statistics.categorical.length} columns`,
        `Data processing completed but AI analysis temporarily unavailable`,
        `Statistical summary generated successfully for further analysis`
      ];
      
      await convex.mutation(api.analysis.updateAIInsights, {
        id: analysisId,
        insights: fallbackInsights
      });
      
      return NextResponse.json({ 
        success: true, 
        insights: fallbackInsights,
        warning: `AI service error: ${response.status}`
      });
    }

    const data: GeminiResponse = await response.json();
    console.log('Full API response:', JSON.stringify(data, null, 2));
    
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Raw AI response text:', aiText);
    
    // Enhanced insight extraction
    let insights: string[] = [];
    
    if (aiText) {
      try {
        // Try to parse as JSON first
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          insights = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed JSON insights:', insights);
        } else {
          throw new Error('No JSON array found');
        }
      } catch (parseError) {
        console.log('JSON parsing failed, trying alternative methods:', parseError);
        
        // Try to extract insights from numbered list or bullet points
        const lines = aiText.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        insights = lines
          .filter(line => 
            line.match(/^\d+\./) || 
            line.match(/^[-*•]/) || 
            line.length > 20
          )
          .map(line => 
            line.replace(/^\d+\.\s*/, '')
               .replace(/^[-*•]\s*/, '')
               .replace(/^"|"$/g, '')
               .trim()
          )
          .filter(line => line.length > 10)
          .slice(0, 5);
        
        console.log('Extracted insights from text:', insights);
      }
    }

    // Enhanced fallback logic
    if (!insights || insights.length === 0) {
      console.log('No insights extracted, using enhanced fallback');
      
      insights = [];
      
      if (statistics.numerical.length > 0) {
        const avgMean = statistics.numerical.reduce((sum, col) => sum + col.mean, 0) / statistics.numerical.length;
        insights.push(`Numerical data shows average mean of ${avgMean.toFixed(2)} across ${statistics.numerical.length} columns`);
        
        const highVariability = statistics.numerical.filter(col => col.std > col.mean * 0.5);
        if (highVariability.length > 0) {
          insights.push(`${highVariability.length} columns show high variability, indicating diverse data patterns`);
        }
      }
      
      if (statistics.categorical.length > 0) {
        const totalUniqueValues = statistics.categorical.reduce((sum, col) => sum + col.uniqueCount, 0);
        insights.push(`Categorical data contains ${totalUniqueValues} total unique values across ${statistics.categorical.length} columns`);
        
        const highCardinality = statistics.categorical.filter(col => col.uniqueCount > 10);
        if (highCardinality.length > 0) {
          insights.push(`${highCardinality.length} categorical columns have high cardinality, suggesting rich categorization`);
        }
      }
      
      // Ensure we have at least 4 insights
      while (insights.length < 4) {
        const remainingInsights = [
          `Dataset "${datasetName}" demonstrates structured data organization`,
          `Data quality appears consistent based on statistical analysis`,
          `Further analysis recommended for deeper business insights`,
          `Data preprocessing completed successfully for visualization`
        ];
        insights.push(remainingInsights[insights.length]);
      }
    }

    // Ensure insights are valid strings
    insights = insights
      .filter(insight => typeof insight === 'string' && insight.trim().length > 0)
      .slice(0, 5);

    console.log('Final insights to save:', insights);

    // Update analysis with AI insights
    try {
      await convex.mutation(api.analysis.updateAIInsights, {
        id: analysisId,
        insights: insights
      });
      console.log('Successfully updated analysis with insights');
    } catch (convexError) {
      console.error('Convex update error:', convexError);
      return NextResponse.json({ 
        error: 'Failed to save insights to database',
        details: convexError instanceof Error ? convexError.message : 'Unknown error'
      }, { status: 500 });
    }

    console.log('AI insights generation completed:', insights.length);
    return NextResponse.json({ success: true, insights });

  } catch (error) {
    console.error('AI insights error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({ 
      error: 'Failed to generate insights',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}