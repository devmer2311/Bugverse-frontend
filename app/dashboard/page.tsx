'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { 
  getTasks, 
  getTasksByUser, 
  createTask, 
  updateTask, 
  deleteTask,
  Task,
  TaskStatus
} from '@/lib/tasks';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import TaskTrendChart from '@/components/dashboard/TaskTrendChart';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilters, { TaskFilters as TTaskFilters } from '@/components/tasks/TaskFilters';
import TimeTrackingModal from '@/components/tasks/TimeTrackingModal';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Dashboard() {
  const router = useRouter();
  const user = getCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [trackingTask, setTrackingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TTaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    type: 'all',
    assignee: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    loadTasks();
  }, [router]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = () => {
    if (!user) return;
    
    const allTasks = user.role === 'manager' ? getTasks() : getTasksByUser(user.id);
    setTasks(allTasks);
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.assigneeName.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(task => task.type === filters.type);
    }

    // Assignee filter
    if (filters.assignee) {
      filtered = filtered.filter(task => task.assigneeId === filters.assignee);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = (taskData: any) => {
    createTask(taskData);
    loadTasks();
  };

  const handleUpdateTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      loadTasks();
      setEditingTask(undefined);
    }
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      loadTasks();
    }
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    const updates: any = { status };
    
    if (status === 'closed') {
      updates.closedAt = new Date().toISOString();
      updates.approvedBy = user?.id;
    }
    
    updateTask(id, updates);
    loadTasks();
  };

  const handleTimeTrack = (task: Task) => {
    setTrackingTask(task);
    setIsTimeModalOpen(true);
  };

  const handleTimeAdded = () => {
    loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const assignees = useMemo(() => {
    const uniqueAssignees = new Map();
    tasks.forEach(task => {
      uniqueAssignees.set(task.assigneeId, {
        id: task.assigneeId,
        name: task.assigneeName
      });
    });
    return Array.from(uniqueAssignees.values());
  }, [tasks]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const pendingApprovalTasks = tasks.filter(t => t.status === 'pending-approval');
  const isManager = user.role === 'manager';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isManager ? 'Manager Dashboard' : 'My Tasks'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isManager 
                  ? 'Overview of all team tasks and progress' 
                  : 'Track your assigned tasks and time spent'
                }
              </p>
            </div>
            <Button 
              onClick={() => setIsTaskFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {isManager && pendingApprovalTasks.length > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have {pendingApprovalTasks.length} task(s) waiting for approval.
            </AlertDescription>
          </Alert>
        )}

        <StatsCards tasks={tasks} isManager={isManager} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <TaskTrendChart userId={isManager ? undefined : user.id} />
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks:</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-medium text-blue-600">
                    {tasks.filter(t => t.status === 'open' || t.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(t => t.status === 'closed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">
                    {tasks.reduce((sum, task) => sum + task.totalTimeSpent, 0).toFixed(1)}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TaskFilters 
            filters={filters}
            onFiltersChange={setFilters}
            assignees={assignees}
          />

          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Tasks ({filteredTasks.length})
              </h2>
            </div>
            
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.type !== 'all' || filters.assignee
                    ? 'Try adjusting your filters to see more tasks.'
                    : 'Get started by creating your first task.'
                  }
                </p>
                <Button 
                  onClick={() => setIsTaskFormOpen(true)}
                  variant="outline"
                >
                  Create Task
                </Button>
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                      onTimeTrack={handleTimeTrack}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <TaskForm
        task={editingTask}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        assignees={assignees.length > 0 ? assignees : [
          { id: user.id, name: user.name }
        ]}
      />

      <TimeTrackingModal
        task={trackingTask}
        isOpen={isTimeModalOpen}
        onClose={() => {
          setIsTimeModalOpen(false);
          setTrackingTask(null);
        }}
        onTimeAdded={handleTimeAdded}
      />
    </div>
  );
}