export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'open' | 'in-progress' | 'pending-approval' | 'closed' | 'reopened';
export type TaskType = 'bug' | 'task' | 'feature' | 'improvement';

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  hours: number;
  date: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  assigneeName: string;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  closedAt?: string;
  approvedBy?: string;
  timeEntries: TimeEntry[];
  totalTimeSpent: number;
}
let tasks: Task[] = [
  {
    id: '1',
    title: 'Email format check fails on login form',
    description: 'The login form’s email field is not correctly validating input format, leading to misleading error prompts.',
    type: 'bug',
    priority: 'high',
    status: 'in-progress',
    assigneeId: '1',
    assigneeName: 'Dev Mer',
    reporterId: '2',
    reporterName: 'DJ',
    createdAt: '2025-06-09T10:00:00Z',
    updatedAt: '2025-06-09T14:30:00Z',
    dueDate: '2025-06-11T17:00:00Z',
    timeEntries: [
      {
        id: 'te1',
        taskId: '1',
        userId: '1',
        description: 'Reviewed and debugged validation logic',
        hours: 2.5,
        date: '2025-06-09',
        createdAt: '2025-06-09T14:30:00Z'
      }
    ],
    totalTimeSpent: 2.5
  },
  {
    id: '2',
    title: 'Dark mode switch with persistent settings',
    description: 'Introduce a dark mode toggle that saves user preferences even after page reloads or logouts.',
    type: 'feature',
    priority: 'medium',
    status: 'pending-approval',
    assigneeId: '1',
    assigneeName: 'Dev Mer',
    reporterId: '1',
    reporterName: 'Dev Mer',
    createdAt: '2025-06-10T09:00:00Z',
    updatedAt: '2025-06-11T16:00:00Z',
    dueDate: '2025-06-13T17:00:00Z',
    timeEntries: [
      {
        id: 'te2',
        taskId: '2',
        userId: '1',
        description: 'Created theme provider and context setup',
        hours: 4,
        date: '2025-06-10',
        createdAt: '2025-06-10T13:00:00Z'
      },
      {
        id: 'te3',
        taskId: '2',
        userId: '1',
        description: 'Added toggle component and local storage logic',
        hours: 1.5,
        date: '2025-06-11',
        createdAt: '2025-06-11T16:00:00Z'
      }
    ],
    totalTimeSpent: 5.5
  },
  {
    id: '3',
    title: 'DB connection timeout during peak hours',
    description: 'Frequent timeouts on API endpoints due to unstable database connectivity under high load conditions.',
    type: 'bug',
    priority: 'critical',
    status: 'open',
    assigneeId: '1',
    assigneeName: 'Dev Mer',
    reporterId: '2',
    reporterName: 'DJ',
    createdAt: '2025-06-09T08:00:00Z',
    updatedAt: '2025-06-09T08:00:00Z',
    dueDate: '2025-06-10T12:00:00Z',
    timeEntries: [],
    totalTimeSpent: 0
  },
  {
    id: '4',
    title: 'Boost dashboard performance with lazy loading',
    description: 'Dashboard load times are slow with large datasets. Introduce pagination and lazy loading techniques.',
    type: 'improvement',
    priority: 'medium',
    status: 'open',
    assigneeId: '1',
    assigneeName: 'Dev Mer',
    reporterId: '2',
    reporterName: 'DJ',
    createdAt: '2025-06-10T15:00:00Z',
    updatedAt: '2025-06-10T15:00:00Z',
    dueDate: '2025-06-14T17:00:00Z',
    timeEntries: [],
    totalTimeSpent: 0
  },
  {
    id: '5',
    title: 'Enable task report exports (PDF & Excel)',
    description: 'Users should be able to export reports in both PDF and Excel formats for offline use and sharing.',
    type: 'feature',
    priority: 'low',
    status: 'closed',
    assigneeId: '1',
    assigneeName: 'Dev Mer',
    reporterId: '2',
    reporterName: 'DJ',
    createdAt: '2025-06-09T10:00:00Z',
    updatedAt: '2025-06-12T17:00:00Z',
    closedAt: '2025-06-12T17:00:00Z',
    approvedBy: '2',
    timeEntries: [
      {
        id: 'te4',
        taskId: '5',
        userId: '1',
        description: 'Explored export package options',
        hours: 1,
        date: '2025-06-09',
        createdAt: '2025-06-09T14:00:00Z'
      },
      {
        id: 'te5',
        taskId: '5',
        userId: '1',
        description: 'Built PDF export functionality',
        hours: 3,
        date: '2025-06-10',
        createdAt: '2025-06-10T16:00:00Z'
      },
      {
        id: 'te6',
        taskId: '5',
        userId: '1',
        description: 'Added Excel export using XLSX library',
        hours: 2.5,
        date: '2025-06-11',
        createdAt: '2025-06-11T15:00:00Z'
      }
    ],
    totalTimeSpent: 6.5
  }
];

// Simple in-memory operations
export const getTasks = (): Task[] => {
  return [...tasks];
};

export const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeEntries' | 'totalTimeSpent'>): Task => {
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeEntries: [],
    totalTimeSpent: 0
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  return tasks.length < initialLength;
};

export const addTimeEntry = (timeEntry: Omit<TimeEntry, 'id' | 'createdAt'>): TimeEntry => {
  const task = tasks.find(t => t.id === timeEntry.taskId);
  if (!task) throw new Error('Task not found');

  const newTimeEntry: TimeEntry = {
    ...timeEntry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  task.timeEntries.push(newTimeEntry);
  task.totalTimeSpent = task.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  task.updatedAt = new Date().toISOString();
  
  return newTimeEntry;
};

export const getTasksByUser = (userId: string): Task[] => {
  return tasks.filter(task => task.assigneeId === userId);
};

export const getDailyTaskTrends = (userId?: string): { date: string; count: number }[] => {
  const filteredTasks = userId ? getTasksByUser(userId) : tasks;
  const dailyCounts = new Map<string, number>();
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyCounts.set(dateStr, 0);
  }
  
  // Count tasks worked on each day (based on timeEntries)
  filteredTasks.forEach(task => {
    task.timeEntries.forEach(entry => {
      const date = entry.date;
      if (dailyCounts.has(date)) {
        dailyCounts.set(date, dailyCounts.get(date)! + 1);
      }
    });
  });
  
  return Array.from(dailyCounts.entries()).map(([date, count]) => ({ date, count }));
};

// No initialization needed for in-memory demo
export const initializeMockData = (): void => {
  // Data is already initialized above
};