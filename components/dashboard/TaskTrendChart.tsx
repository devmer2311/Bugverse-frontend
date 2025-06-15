'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailyTaskTrends } from '@/lib/tasks';
import { TrendingUp } from 'lucide-react';

interface TaskTrendChartProps {
  userId?: string;
}

export default function TaskTrendChart({ userId }: TaskTrendChartProps) {
  const trends = useMemo(() => getDailyTaskTrends(userId), [userId]);
  
  const maxCount = Math.max(...trends.map(t => t.count), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Task Activity Trend (Last 7 Days)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-end space-x-2 h-32">
            {trends.map((trend, index) => (
              <div key={trend.date} className="flex-1 flex flex-col items-center space-y-2">
                <div className="flex-1 flex items-end">
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{ 
                      height: `${(trend.count / maxCount) * 100}%`,
                      minHeight: trend.count > 0 ? '8px' : '2px'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {formatDate(trend.date)}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {trend.count}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Number of tasks worked on per day
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}