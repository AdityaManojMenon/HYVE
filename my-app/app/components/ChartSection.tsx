"use client";

import { useEffect, useRef } from 'react';
import { LocationRecommendation } from '../types';
import { Chart, registerables, ChartType, ChartData, ChartOptions } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface ChartSectionProps {
  data: LocationRecommendation[];
  rentBudget: number;
}

export default function ChartSection({ data, rentBudget }: ChartSectionProps) {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const bubbleChartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!data.length) return;
    
    let barChart: Chart | undefined;
    let bubbleChart: Chart | undefined;
    
    // Create bar chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (barChart) barChart.destroy();
        
        const barChartData: ChartData<'bar'> = {
          labels: data.map(item => `${item.city}, ${item.state}`),
          datasets: [{
            label: 'Match Score',
            data: data.map(item => item.score * 100),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        };
        
        const barChartOptions: ChartOptions<'bar'> = {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Match Score (%)'
              },
              max: 100
            },
            x: {
              title: {
                display: true,
                text: 'Location'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Top Locations by Match Score',
              font: {
                size: 16
              }
            }
          }
        };
        
        barChart = new Chart(ctx, {
          type: 'bar',
          data: barChartData,
          options: barChartOptions
        });
      }
    }
    
    // Create scatter chart for rent vs job count
    if (bubbleChartRef.current) {
      const ctx = bubbleChartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (bubbleChart) bubbleChart.destroy();
        
        const maxJobCount = Math.max(...data.map(item => item.job_count));
        const scaledJobCounts = data.map(item => Math.max(item.job_count, 1) / maxJobCount * 20 + 10);
        
        const scatterChartData: ChartData<'scatter'> = {
          datasets: [{
            label: 'Cities',
            data: data.map((item, index) => ({
              x: index,
              y: item.avg_rent,
              r: scaledJobCounts[index]
            })),
            backgroundColor: data.map(item => 
              `rgba(${Math.floor(255 * (1 - item.score))}, ${Math.floor(255 * item.score)}, 200, 0.7)`
            ),
            borderColor: data.map(item => 
              `rgba(${Math.floor(255 * (1 - item.score))}, ${Math.floor(255 * item.score)}, 200, 1)`
            ),
            borderWidth: 1
          }]
        };
        
        const scatterChartOptions: ChartOptions<'scatter'> = {
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Average Monthly Rent ($)'
              }
            },
            x: {
              type: 'category',
              labels: data.map(item => `${item.city}, ${item.state}`),
              title: {
                display: true,
                text: 'Location'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const index = context.dataIndex;
                  const item = data[index];
                  return [
                    `${item.city}, ${item.state}`,
                    `Rent: $${item.avg_rent.toLocaleString()}`,
                    `Job Count: ${item.job_count}`,
                    `Match Score: ${item.score_percentage}`
                  ];
                }
              }
            },
            title: {
              display: true,
              text: 'Rent vs Job Opportunities (bubble size = job count)',
              font: {
                size: 16
              }
            }
          }
        };
        
        // Add budget line manually
        bubbleChart = new Chart(ctx, {
          type: 'scatter',
          data: scatterChartData,
          options: scatterChartOptions
        });
        
        // Draw a horizontal line for the budget after the chart is created
        const originalDraw = bubbleChart.draw;
        bubbleChart.draw = function() {
          originalDraw.call(this);
          
          if (ctx && this.scales.y) {
            const yAxis = this.scales.y;
            const budgetY = yAxis.getPixelForValue(rentBudget);
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(this.chartArea.left, budgetY);
            ctx.lineTo(this.chartArea.right, budgetY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            
            // Add budget label
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`Your Budget: $${rentBudget.toLocaleString()}`, this.chartArea.right, budgetY - 5);
            ctx.restore();
          }
        };
      }
    }
    
    return () => {
      // Clean up charts when component unmounts
      if (barChart) barChart.destroy();
      if (bubbleChart) bubbleChart.destroy();
    };
  }, [data, rentBudget]);
  
  if (!data.length) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Location Analysis
      </h2>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <canvas ref={barChartRef} />
        </div>
        <div>
          <canvas ref={bubbleChartRef} />
        </div>
      </div>
    </div>
  );
} 