'use client';

import { Task, TaskPriority, TaskStatus } from '@/lib/tasks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Calendar, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  RotateCcw,
  Play
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onTimeTrack: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
  'pending-approval': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  closed: 'bg-green-100 text-green-800 border-green-200',
  reopened: 'bg-orange-100 text-orange-800 border-orange-200'
};

const typeColors = {
  bug: 'bg-red-50 text-red-700',
  task: 'bg-blue-50 text-blue-700',
  feature: 'bg-green-50 text-green-700',
  improvement: 'bg-purple-50 text-purple-700'
};

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onTimeTrack 
}: TaskCardProps) {
  const user = getCurrentUser();
  const isManager = user?.role === 'manager';
  const canEdit = user?.id === task.assigneeId || isManager;
  const canDelete = user?.id === task.reporterId || isManager;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'closed';

  const getStatusActions = () => {
    if (!canEdit) return null;

    switch (task.status) {
      case 'open':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(task.id, 'in-progress')}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </Button>
        );
      case 'in-progress':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(task.id, 'pending-approval')}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Button>
        );
      case 'pending-approval':
        if (isManager) {
          return (
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(task.id, 'closed')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(task.id, 'reopened')}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reopen
              </Button>
            </div>
          );
        }
        return null;
      case 'reopened':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(task.id, 'in-progress')}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Play className="h-3 w-3 mr-1" />
            Resume
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="secondary" className={typeColors[task.type]}>
                {task.type}
              </Badge>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={statusColors[task.status]}>
                {task.status.replace('-', ' ')}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {task.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{task.assigneeName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{task.totalTimeSpent.toFixed(1)}h</span>
            </div>
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex space-x-2">
            {getStatusActions()}
            {(task.status === 'in-progress' || task.status === 'open') && canEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTimeTrack(task)}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                <Clock className="h-3 w-3 mr-1" />
                Log Time
              </Button>
            )}
          </div>
          
          <div className="flex space-x-1">
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(task)}
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {canDelete && task.status !== 'closed' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}