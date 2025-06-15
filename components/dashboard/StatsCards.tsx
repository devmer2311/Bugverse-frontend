'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/tasks';
import { 
  Bug, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';

interface StatsCardsProps {
  tasks: Task[];
  isManager?: boolean;
}

export default function StatsCards({ tasks, isManager = false }: StatsCardsProps) {
  const openTasks = tasks.filter(t => t.status === 'open' || t.status === 'in-progress');
  const closedTasks = tasks.filter(t => t.status === 'closed');
  const pendingApproval = tasks.filter(t => t.status === 'pending-approval');
  const criticalTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'closed');
  const totalTimeSpent = tasks.reduce((sum, task) => sum + task.totalTimeSpent, 0);

  const stats = [
    {
      title: 'Open Tasks',
      value: openTasks.length,
      icon: Bug,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Active tasks in progress'
    },
    {
      title: 'Completed',
      value: closedTasks.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Successfully resolved'
    },
    {
      title: 'Pending Approval',
      value: pendingApproval.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Awaiting manager review'
    },
    {
      title: 'Critical Issues',
      value: criticalTasks.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'High priority items'
    },
    {
      title: 'Total Hours',
      value: `${totalTimeSpent.toFixed(1)}h`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Time invested'
    }
  ];

  if (isManager) {
    const uniqueAssignees = new Set(tasks.map(t => t.assigneeId)).size;
    stats.push({
      title: 'Team Members',
      value: uniqueAssignees,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Active developers'
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}