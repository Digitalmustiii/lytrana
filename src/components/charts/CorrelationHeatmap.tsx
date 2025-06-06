// components/charts/CorrelationHeatmap.tsx
import React from 'react';

interface CorrelationData {
  x: string;
  y: string;
  value: number;
}

interface CorrelationHeatmapProps {
  data: CorrelationData[];
  title?: string;
  height?: number;
}

export default function CorrelationHeatmap({ data, title, height = 400 }: CorrelationHeatmapProps) {
  // Get unique x and y values
  const xValues = [...new Set(data.map(d => d.x))];
  const yValues = [...new Set(data.map(d => d.y))];
  
  // Create a map for quick lookup
  const valueMap = new Map(data.map(d => [`${d.x}-${d.y}`, d.value]));
  
  // Color scale function
  const getColor = (value: number) => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(46, 242, 115, ${intensity})`; // Green for positive
    } else {
      return `rgba(255, 107, 107, ${intensity})`; // Red for negative
    }
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-white font-medium mb-4">{title}</h3>}
      <div style={{ height }} className="overflow-auto">
        <div className="grid gap-1 p-4" style={{ 
          gridTemplateColumns: `repeat(${xValues.length + 1}, minmax(60px, 1fr))`,
          minWidth: `${(xValues.length + 1) * 70}px`
        }}>
          {/* Empty top-left cell */}
          <div className="h-12"></div>
          
          {/* X-axis labels */}
          {xValues.map(x => (
            <div key={x} className="h-12 flex items-center justify-center text-xs text-gray-300 font-medium">
              {x}
            </div>
          ))}
          
          {/* Y-axis labels and correlation cells */}
          {yValues.map(y => (
            <React.Fragment key={y}>
              <div className="h-12 flex items-center justify-center text-xs text-gray-300 font-medium pr-2">
                {y}
              </div>
              {xValues.map(x => {
                const value = valueMap.get(`${x}-${y}`) || 0;
                return (
                  <div
                    key={`${x}-${y}`}
                    className="h-12 flex items-center justify-center text-xs font-bold text-white rounded border border-gray-600 cursor-pointer hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: getColor(value) }}
                    title={`${x} vs ${y}: ${value.toFixed(3)}`}
                  >
                    {value.toFixed(2)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}